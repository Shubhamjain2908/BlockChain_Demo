const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuid().split('-').join('');

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', function(req, res){
    res.send(bitcoin);
});

app.post('/transaction', function(req, res){
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTrascationToPendingTranscation(newTransaction);
    res.json({note: `Transaction will be added in block ${blockIndex}`});
});

app.post('/transaction/broadcast', function(req, res){
    const newTransaction = bitcoin.createNewTransactions(req.body.amount, req.body.sender, req.body.recipient);
    bitcoin.addTrascationToPendingTranscation(newTransaction);

    //broadcasting transcation
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises).then(data => {
        res.json({note: 'Transaction created and broadcast successfully. '});
    }).catch(function (err) {
        console.log(err);
   });
});

app.get('/mine', function(req, res){
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
  
    // bitcoin.createNewTransactions(12.5, '00', nodeAddress);     // broadcast this transaction to all nodes
    /** Creating new Block */
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    /**
     * Broadcasting that newBlock to each node in the Network
     */
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: {newBlock: newBlock},
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });

    /**
     * Mining reward transaction and broadcast to entire blockchain network
     */
    Promise.all(requestPromises).then(data => {
        //
        const requestOptions = {
            uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 12.5,
                sender: "00",
                recipient: nodeAddress
            },
            json: true
        };
        return rp(requestOptions);
    }).then(data => {
        res.json({
            note: 'New Block mined & broadcast successfully...!!!',
            block: newBlock
        });
    }).catch(function (err) {
        console.log(err);
   });
});

app.post('/receive-new-block', function(req, res) {
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
    if(correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            note: 'New block recieved and accepted',
            newBlock: newBlock
        });
    } else {
        res.json({
            note: 'New block rejected',
            newBlock: newBlock
        });
    }
});

//register a node and broadcast it to this network
app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
        bitcoin.networkNodes.push(newNodeUrl)
    }

    const regNodesPromise = [];
    // making request to each node in the network
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        // '/register-node'
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true
        };

        regNodesPromise.push(rp(requestOptions));
    });

    // registering all nodes with the newly aadded node
    Promise.all(regNodesPromise).then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: { allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl] },
            json: true
        };
        return rp(bulkRegisterOptions);
    }).then(data => {
        res.json({ note: 'New node register with network successfully' });
    }).catch(function () {
        console.log("Promise Rejected");
   });
});

//register a node with the network
app.post('/register-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if(nodeNotAlreadyPresent && notCurrentNode && newNodeUrl !== null) bitcoin.networkNodes.push(newNodeUrl);
    res.json({note: 'New node register successfully'});
});

//register multiple nodes with the network
app.post('/register-nodes-bulk', function(req, res) {
   const allNetworkNodes = req.body.allNetworkNodes;
   allNetworkNodes.forEach(networkNodeUrl => {
       const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
       const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
       if(nodeNotAlreadyPresent && notCurrentNode && networkNodeUrl !== null) bitcoin.networkNodes.push(networkNodeUrl);
   }); 

   res.json({note: 'Bulk regostrationn successfully...'});
});

app.get('/concensus', function (req, res) {
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises).then(blockchains => {
        const currentChainLength = bitcoin.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;

        blockchains.forEach(blockchain => {
            if (blockchain.chain.length > maxChainLength) {
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newPendingTransactions = blockchain.pendingTransactions;
            }
        });
        if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
            res.json({
                note: 'Current chain has not been replaced',
                chain: bitcoin.chain
            });
        } else { // if (newLongestChain && bitcoin.chainIsValid(newLongestChain)) 
            bitcoin.chain = newLongestChain;
            bitcoin.pendingTransactions = newPendingTransactions;
            res.json({
                note: 'This chain has been replaced.',
                chain: bitcoin.chain
            });
        }
    }).catch(function (error) {
        console.log(error);
    });
});

app.get('/block/:blockHash', function (req, res) { //localhost:3301/block/a1290iolkajkas
    const blockHash = req.params.blockHash; 
    const correctBlock = bitcoin.getBlock(blockHash);
    res.json({
        block: correctBlock
    });
});

app.get('/transaction/:transactionId', function (req, res) {
    const transactionId = req.params.transactionId;
    const transactionData = bitcoin.getTransaction(transactionId);
    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    });
});

app.get('/address/:address', function (req, res) {
    const address = req.params.address;
    const addressData = bitcoin.getAddressData(address);
    res.json({
        addressData: addressData
    });
});

app.listen(port, function(){
    console.log(`Listening on port ${port}...`);
});
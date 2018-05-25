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
    const blockIndex = bitcoin.createNewTransactions(req.body.amount, req.body.sender, req.body.recipient);
    res.json({note: `Transaction will be added in block ${blockIndex}.`});
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
  
    bitcoin.createNewTransactions(12.5, '00', nodeAddress);

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    res.json({
        note: 'New Block mined successfully...!!!',
        block: newBlock
    });
});

//register a node and broadcast it to this network
app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
        bitcoin.networkNodes.push(newNodeUrl)
    }

    const regNodesPromise = [];
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
    });
});

//register a node with the network
app.post('/register-node', function(req, res) {
    
});

//register multiple nodes with the network
app.post('/register-nodes-bulk', function(req, res) {
    
});

app.listen(port, function(){
    console.log(`Listening on port ${port}...`);
});
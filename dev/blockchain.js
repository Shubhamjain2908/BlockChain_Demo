const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = []; 
    /**
     * Creating Genesis block : starting block of blockchain
     */
    this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timeStamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash
    };
    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock; 
}

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransactions = function(amount, sender, recipient) {
    const newTranscation = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid().split('-').join('')
    };
    return newTranscation;
}

Blockchain.prototype.addTrascationToPendingTranscation = function(transcationObj) {
    this.pendingTransactions.push(transcationObj);
    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
/**
 * bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)
 * => repeatedly hash block until it finds out correct hash i.e., 4 0's (0000) at starting
 * => uses currectly blockdata and previous hash
 * => continuously changes nonce value uptill it finds correct hash
 * => returns nonce value when correct hash(0000) is created 
 */
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while(hash.substring(0,4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
}

/**
 * Method used to valid the chain by comparing hash of each block with previous block hash
 * @param {Blockchain} blockchain 
 */
Blockchain.prototype.chainIsValid = function(blockchain) {
    let validChain = true;
    for (let i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const previousBlock = blockchain[i-1];
        //console.log(blockchain);
        const blockHash = this.hashBlock(previousBlock['hash'], {transactions: currentBlock['transactions'], index: currentBlock['index']}, currentBlock['nonce']);
        if(blockHash.substring(0, 4) !== '0000') validChain = false;
        if(currentBlock['previousBlockHash'] !== previousBlock['hash']) validChain = false;
    }

    //checking genesis block
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const corrrectHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;

    if(!correctNonce || !correctPreviousBlockHash || !corrrectHash || !correctTransactions) validChain = false;

    return validChain;
}

Blockchain.prototype.getBlock = function (blockHash) {
    let correctBlock = null;
    this.chain.forEach(block => {
        if (block.hash === blockHash) correctBlock = block;
    });
    return correctBlock;
}

Blockchain.prototype.getTransaction = function (transactionId) {
    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if(transaction.transactionId === transactionId) {
                correctTransaction = transaction;
                correctBlock = block;
            }
        });
    });
    return {
        transaction: correctTransaction,
        block: correctBlock
    };
}

Blockchain.prototype.getAddressData = function (address) {
    const addressTransactions = [];
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if(transaction.sender === address || transaction.recipient === address) {
                addressTransactions.push(transaction);
            }
        });
    });
    let balance = 0;
    addressTransactions.forEach(transaction => {
        if (transaction.recipient === address) balance += transaction.amount;
        else if (transaction.sender === address) balance -= transaction.amount;
    });

    return {
        addressTransactions: addressTransactions,
        addressBalance: balance
    };
}

module.exports = Blockchain;
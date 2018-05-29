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
module.exports = Blockchain;
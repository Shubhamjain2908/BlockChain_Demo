function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
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

Blockchain.prototype.createNewTransactions = function(amount, sender, recipent) {
    const newTranscation = {
        amount: amount,
        sender: sender,
        recipent: recipent
    };

    this.pendingTransactions.push(newTranscation);

    return this.getLastBlock['index'] + 1;
}
module.exports = Blockchain;
const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();
bitcoin.createNewBlock(8211, '01NHAKK8121JAOWNX', '01810JK8121JKAHAZ');
// bitcoin.createNewBlock(1239, '01810JK8121JKAHAZ', '618JKASKJ012912JS');
// bitcoin.createNewBlock(8992, '618JKASKJ012912JS', '127823HKKJHAUSIUS');
bitcoin.createNewTransactions(7182, 'Shubham98128', 'Jain180913210');

bitcoin.createNewBlock(1239, '01810JK8121JKAHAZ', '618JKASKJ012912JS');

bitcoin.createNewTransactions(1829, 'Shubham98128', 'Jain180913210');
bitcoin.createNewTransactions(8121, 'SJ1201398109', 'Jain180913210');
bitcoin.createNewTransactions(3892, 'Aj8120912019', 'Jain180913210');

bitcoin.createNewBlock(8992, '618JKASKJ012912JS', '127823HKKJHAUSIUS');

console.log(bitcoin.chain[2]);
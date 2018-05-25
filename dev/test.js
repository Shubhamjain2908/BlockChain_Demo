const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
console.log(bitcoin);

// const previousBlockHash = 'SAKHKJ19082301LKJSAD';
// const currentBlockData = [
//     {   
//         amount: 7829,
//         sender: 'Shubham98128',
//         recipent: 'Jain180913210' 
//     },
//     {   
//         amount: 8121,
//         sender: 'SJ1201398109',
//         recipent: 'Jain180913210' 
//     },
//     {   
//         amount: 3892,
//         sender: 'Aj8120912019',
//         recipent: 'Jain180913210' 
//     }
// ];
// const nonce = 100;
// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce ));
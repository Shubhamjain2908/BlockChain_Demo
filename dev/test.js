const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
const bc1 = {
    "chain": [
    {
    "index": 1,
    "timeStamp": 1527582199212,
    "transactions": [],
    "nonce": 100,
    "hash": "0",
    "previousBlockHash": "0"
    },
    {
    "index": 2,
    "timeStamp": 1527582210308,
    "transactions": [],
    "nonce": 18140,
    "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    "previousBlockHash": "0"
    },
    {
    "index": 3,
    "timeStamp": 1527582295643,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "8aff27b0631911e89bb50f4a47583aab",
    "transactionId": "91a4d0b0631911e89bb50f4a47583aab"
    },
    {
    "amount": 100,
    "sender": "Ako0219831",
    "recipient": "JIUS918091",
    "transactionId": "a4d058d0631911e89bb50f4a47583aab"
    },
    {
    "amount": 200,
    "sender": "Ako0219831",
    "recipient": "JIUS918091",
    "transactionId": "a782cea0631911e89bb50f4a47583aab"
    },
    {
    "amount": 300,
    "sender": "Ako0219831",
    "recipient": "JIUS918091",
    "transactionId": "a9d968d0631911e89bb50f4a47583aab"
    }
    ],
    "nonce": 212226,
    "hash": "0000911484650ca1a4912e8f6389ff375258640b6fa873080bd71c28a4753b74",
    "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
    "index": 4,
    "timeStamp": 1527582357948,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "8aff27b0631911e89bb50f4a47583aab",
    "transactionId": "c47c8ff0631911e89bb50f4a47583aab"
    },
    {
    "amount": 400,
    "sender": "Ako0219831",
    "recipient": "JIUS918091",
    "transactionId": "cc0bfcb0631911e89bb50f4a47583aab"
    },
    {
    "amount": 500,
    "sender": "Ako0219831",
    "recipient": "JIUS918091",
    "transactionId": "d74fbee0631911e89bb50f4a47583aab"
    },
    {
    "amount": 600,
    "sender": "Ako0219831",
    "recipient": "JIUS918091",
    "transactionId": "db545730631911e89bb50f4a47583aab"
    }
    ],
    "nonce": 641,
    "hash": "0000757da47987a6f527d36826f66c7f59913f5093a8cf890d281dd41078c4c3",
    "previousBlockHash": "0000911484650ca1a4912e8f6389ff375258640b6fa873080bd71c28a4753b74"
    },
    {
    "index": 5,
    "timeStamp": 1527582385132,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "8aff27b0631911e89bb50f4a47583aab",
    "transactionId": "e99c7fc0631911e89bb50f4a47583aab"
    }
    ],
    "nonce": 52879,
    "hash": "00001d2524656cba7797a3baf037d7030226723e0bb428f436b4dd9aba6a732d",
    "previousBlockHash": "0000757da47987a6f527d36826f66c7f59913f5093a8cf890d281dd41078c4c3"
    },
    {
    "index": 6,
    "timeStamp": 1527582388087,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "8aff27b0631911e89bb50f4a47583aab",
    "transactionId": "f9d0e7f0631911e89bb50f4a47583aab"
    }
    ],
    "nonce": 4821,
    "hash": "000037c0916fe06a9ebceeb6976b6fd8a56c752ff5e0f7f9da6f5839545bbff6",
    "previousBlockHash": "00001d2524656cba7797a3baf037d7030226723e0bb428f436b4dd9aba6a732d"
    }
    ],
    "pendingTransactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "8aff27b0631911e89bb50f4a47583aab",
    "transactionId": "fb93f4b0631911e89bb50f4a47583aab"
    }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
    };

    console.log('VALID: ', bitcoin.chainIsValid(bc1.chain));

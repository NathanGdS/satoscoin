const { BlockChain } = require("./BlockChain");
const { Transaction } = require("./Transaction");

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// pegando a chave publica e a wallet
const myKey = ec.keyFromPrivate('020f33b28633ae626ac884ba99edea2e3efd03d9c75b2d41693a637fa7c35c4b');
const myWalletAddress = myKey.getPublic('hex');

const satosCoin = new BlockChain();

makeTransaction(myWalletAddress, 'address goes here', 10, myKey);

console.log("\nComeçando a mineração...");
satosCoin.minePendingTransactions(myWalletAddress);
console.log("\nBalance of Nathan is", satosCoin.getAddressBalance(myWalletAddress));


function makeTransaction(from, to, amount, key) {
    const tx = new Transaction(from, to, amount);
    tx.sign(key);
    satosCoin.newTransaction(tx);
}
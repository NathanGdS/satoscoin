const { BlockChain } = require("./BlockChain");
const { Block } = require("./Block");
const { Transaction } = require("./Transaction");



const satosCoin = new BlockChain();
satosCoin.newTransaction(new Transaction('address1', 'address2', 100));
satosCoin.newTransaction(new Transaction('address2', 'address1', 100));

console.log("\nComeçando a mineração...");
satosCoin.minePendingTransactions('nathan-address');

console.log("\nBalance of Nathan is", satosCoin.getAddressBalance('nathan-address'));

console.log("\nComeçando a mineração denovo...");
satosCoin.minePendingTransactions('nathan-address');

console.log("\nBalance of Nathan is", satosCoin.getAddressBalance('nathan-address'));


// console.log(satosCoin);

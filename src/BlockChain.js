const EC = require("elliptic").ec, ec = new EC("secp256k1");


const { Block } = require("./Block");
const { Transaction } = require("./Transaction");

class BlockChain {

    constructor () {
        this.chain = [this.createGenesisBlock()];
        this.blockTime = 10000;
        this.pendingTransactions = [];
        this.reward = 50;
        this.networkDificulty = 1;
    }
    createGenesisBlock() {
        return new Block(Date.now().toString(), ["Genesis", "Block"])
    }

    getPreviousBlock () {
        return this.chain[this.chain.length - 1];
    }

    getAddressBalance (address) {
        let balance = 0;
        this.chain.forEach(block => {
            block.data.forEach(transaction => {
                if (transaction.from === address) {
                    balance -= transaction.amount;
                }

                if (transaction.to === address) {
                    balance += transaction.amount;
                }
            });
        });

        return balance;
    }

    minePendingTransactions (miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mine(this.networkDificulty);

        console.log('BLOCK MINED ', block.hash);
        this.chain.push(block);
        // block.data.push([this.pendingTransactions]);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.reward)
        ];
    }

    newTransaction (transaction) {
        if (transaction.isValid(transaction, this)) {
            this.pendingTransactions.push(transaction);
        }
    }

    checkHealth (blockChain = this) {
        for (let i = 1; i< blockChain.chain.length; i ++) {
            const currentBlock = blockChain.chain[i];
            const previousBlock = blockChain.chain[i-1];

            if (
                currentBlock.hash !== currentBlock.calculateHash() || 
                currentBlock.previousHash !== previousBlock.hash   ||
                currentBlock.hasValidTransactions(blockChain)
            ) {
                return false; 
            }
        }

        return true;
    }
}

module.exports.BlockChain = BlockChain;
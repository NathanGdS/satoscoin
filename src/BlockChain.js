const EC = require("elliptic").ec, ec = new EC("secp256k1");


const { Block } = require("./Block");
const { Transaction } = require("./Transaction");

class BlockChain {

    constructor () {
        this.chain = [this.createGenesisBlock()];
        this.blockTime = 1000;
        this.pendingTransactions = [];
        this.reward = 50;
        this.networkDificulty = 1;
    }
    createGenesisBlock() {
        return new Block(Date.now().toString(), ["Genesis", "Block"], '0')
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
        const rewardTx = new Transaction(null, miningRewardAddress, this.reward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getPreviousBlock().hash);
        block.mine(this.networkDificulty);

        console.log('BLOCK MINED ', block.hash);
        this.chain.push(block);

        this.pendingTransactions = [];

        this.networkDificulty += Date.now() - parseInt(this.getPreviousBlock().timestamp) < this.blockTime ? 1 : -1;

    }

    newTransaction (transaction) {
        if (transaction.isValid(this)) {
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
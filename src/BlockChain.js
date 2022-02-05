const EC = require("elliptic").ec, ec = new EC("secp256k1");

const MINT_KEY_PAIR = ec.genKeyPair();
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");
const holderKeyPair = ec.genKeyPair();


const { Block } = require("./Block");
const { Transaction } = require("./Transaction");

class BlockChain {

    constructor () {
        const firstCoinRelease = new Transaction(MINT_PUBLIC_ADDRESS, holderKeyPair.getPublic("hex"), 1000);
        this.chain = [new Block(Date.now().toString(), ["Genesis", "Block"])];
        this.blockTime = 10000;
        this.transactions = [];
        this.reward = 50;
        this.networkDificulty = 1;
    }

    /**
     * 
     * @returns {Block}
     */
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

    /**
     * 
     * @param {Block} block 
     */
    newBlock (block) {
        block.previousHash = this.getPreviousBlock().hash;
        block.hash = block.calculateHash();

        block.mine(this.networkDificulty);

        this.chain.push(block);

        this.networkDificulty += (
            Date.now() - parseInt(this.getPreviousBlock().timestamp) < this.blockTime ? 1 : -1
        );
    }

    newTransaction (transaction) {
        if (transaction.isValid(transaction, this)) {
            this.transactions.push(transaction);
        }
    }

    mineTransactions (rewardAddres) {
        const rewardTransaction = new Transaction(MINT_PUBLIC_ADDRESS, rewardAddres, this.reward);
        rewardTransaction.sign(MINT_KEY_PAIR);

        if (this.transactions.length !== 0 ) {
            this.newBlock(
                new Block(Date.now().toString(),
               [new Transaction(CREATE_REWARD_ADDRESS, rewardAddres, this.reward), ...this.transactions])
           );
        }

        this.transactions = [];
    }

    /**
     * 
     * @param {this} blockChain 
     * @returns {boolean}
     */

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
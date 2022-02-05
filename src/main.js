const crypto = require("crypto");

class Block {
    /**
     * 
     * @param {number} timestamp 
     * @param {[]} data 
     */
    constructor(timestamp = "", data = []) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.calculateHash();
        this.previousHash = "";
        this.nonce = 0;
    }

    /**
     * 
     * @returns {string}
     */

    calculateHash() {
        return crypto.createHash('sha256').update(JSON.stringify(this.data) + this.timestamp + this.previousHash + this.nonce).digest('hex');
    }

    /**
     * 
     * @param {number} networkDificulty 
     */

    mine (networkDificulty) {
        while (!this.hash.startsWith(
            Array(networkDificulty +1).join("0"))
        ) {
            this.nonce++;
            this.hash = this.calculateHash(); 
        }
    }
    
}

class BlockChain {

    constructor () {
        this.chain = [new Block(Date.now().toString(), ["Genesis", "Block"])];
        this.networkDificulty = 1;
        this.blockTime = 30000;
    }

    /**
     * 
     * @returns {Block}
     */
    getPreviousBlock () {
        return this.chain[this.chain.length - 1];
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
                currentBlock.previousHash !== previousBlock.hash
            ) {
                return false; 
            }
        }

        return true;
    }
}


const SatosChain = new BlockChain();
SatosChain.newBlock(new Block(Date.now().toString(),["First", "Block"]));
SatosChain.newBlock(new Block(Date.now().toString(),["Second", "Block"]));
SatosChain.newBlock(new Block(Date.now().toString(),["Third", "Block"]));
SatosChain.newBlock(new Block(Date.now().toString(),["Fourth", "Block"]));
SatosChain.newBlock(new Block(Date.now().toString(),["Fifth", "Block"]));
SatosChain.newBlock(new Block(Date.now().toString(),["Sixth", "Block"]));
SatosChain.newBlock(new Block(Date.now().toString(),["Seventh", "Block"]));


console.log(SatosChain);


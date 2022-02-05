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
    }

    /**
     * 
     * @returns {string}
     */

    calculateHash() {
        return crypto.createHash('sha256').update(JSON.stringify(this.data) + this.timestamp + this.previousHash).digest('hex');
    }
}

class BlockChain {

    constructor () {
        this.chain = [new Block(Date.now().toString(), ["Genesis", "Block"])];
        
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

        this.chain.push(block);
    }


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
SatosChain.newBlock(
    new Block(Date.now().toString(),
    ["First", "Block"]
    ));

SatosChain.newBlock(
    new Block(Date.now().toString(),
    ["Second", "Block"]
    ));

// SatosChain.newBlock(
//     new Block(Date.now().toString(),
//     ["Third", "Block"]
//     ));

console.log(SatosChain.chain);

console.log(
    `\nA Chain é valida? ${SatosChain.checkHealth()}`
);

console.log("\nMudando a chain...");
SatosChain.chain[1].hash = "asyihadsa";
console.log(
    `\nA Chain é valida? ${SatosChain.checkHealth()}`
);
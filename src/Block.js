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

    hasValidTransactions (chain) {
        return this.data.every(transaction => transaction.isValid(transaction, chain));
    }
    
}

module.exports.Block = Block;
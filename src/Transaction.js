const crypto = require("crypto"), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");
const EC = require("elliptic").ec, ec = new EC("secp256k1");

const MINT_KEY_PAIR = ec.genKeyPair();
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");

class Transaction {
    constructor (from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }

    sign (keyPair) {
        if (keyPair.getPublic("hex") === this.from) {
            this.signature = keyPair.sign(SHA256(this.from + this.to + this.amount), "base64").toDER("hex");
        }
    }

    isValid (tx, chain) {
        return (
            tx.from   &&
            tx.to     &&
            tx.amount &&
            (chain.getAddressBalance(tx.from) >= tx.amount || tx.from === MINT_PUBLIC_ADDRESS && tx.amount === this.reward )&&
            ec.keyFromPublic (tx.from, "hex").verify(SHA256(tx.from + tx.to + tx.amount), tx.signature)
        );
    }

}

module.exports.Transaction = Transaction;
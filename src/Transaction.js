const crypto = require("crypto"), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");
const EC = require("elliptic").ec, ec = new EC("secp256k1");

class Transaction {
    constructor (from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }

    sign (keyPair) {
        if (keyPair.getPublic("hex") === this.from) {
            this.signature = keyPair.sign(SHA256(this.from + this.to + this.amount), "base64").toDER("hex");
        }else {
            throw new Error('Voce nao pode assinar transacoes de outras carteiras!');
        }
    }

    isValid () {
        if (this.from === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error ('Sem assinatura nessa transacao!');
        }

        const publicKey = ec.keyFromPublic(this.from, 'hex');
        return publicKey.verify(SHA256(this.from + this.to + this.amount), this.signature)

        // return (
        //     tx.from   &&
        //     tx.to     &&
        //     tx.amount &&
        //     (chain.getAddressBalance(tx.from) >= tx.amount) &&
        //     ec.keyFromPublic (tx.from, "hex").verify(SHA256(tx.from + tx.to + tx.amount), tx.signature)
        // );
    }

}

module.exports.Transaction = Transaction;
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

    isValid (chain) {
        if (this.from === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error ('Sem assinatura nessa transacao!');
        }

        // if (!(chain.getAddressBalance(this.from) >= this.amount)) throw new Error ('Saldo Insuficiente!');

        const publicKey = ec.keyFromPublic(this.from, 'hex');
        return (
            publicKey.verify(SHA256(this.from + this.to + this.amount), this.signature)
        )

    }

}

module.exports.Transaction = Transaction;
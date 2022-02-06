const readline = require("readline");
const { KeyGenerator } = require("./KeyGenerator");
const { BlockChain } = require("./BlockChain");
const { Transaction } = require("./Transaction");

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'satos> '
});

const satosCoin = new BlockChain();

rl.prompt();

rl.on('line', async (line) => {

    switch (line.trim()) {

        case 'generate-keys':
            new KeyGenerator();
            break;

        case 'make-transaction':
            await startTransaction(satosCoin);
            break;

        case 'mine': 
            console.log('Mining...\n');
            await minePendingTransactions();
            break;

        case 'pending-transaction':
            console.log(satosCoin.pendingTransactions);
            break;

        case 'view-address':
            await getAddressBalance();
            break;
            
        case 'view-chain':
            console.log(satosCoin);
            break;

        case 'cls':
            console.clear();
            break;

        default:
            console.log(`Invalid command! '${line.trim()}'`);
            break;
    }

    rl.prompt();

}).on('close', () => {

    console.log('Have a great day!');
    process.exit(0);

});


async function startTransaction(chain) {
    rl.question("Type 'to', 'amount' and your 'private_key' separate by one space: ", (data) => {
        const field = data.split(" ");
        
        const to = field[0];
        const amount = field[1];
        const privateKey = field[2];

        makeTransaction(chain, to, amount, privateKey);
        console.log('Transaction added to pending transactions');
        rl.prompt();
    });
}

async function minePendingTransactions() {
    rl.question("Type the wallet to receive the reward: ", (addr) => {
        satosCoin.minePendingTransactions(addr);
        rl.prompt();
    });
}

async function getAddressBalance() {
    rl.question("Type the address wallet to check the balance: ", (addr) => {
        console.log(`\nBalance of ${addr} is`, satosCoin.getAddressBalance(addr));
        rl.prompt();
    });
}

function makeTransaction(chain, to, amount, privateKey) {
    const key = ec.keyFromPrivate(privateKey);
    const myWalletAddress = key.getPublic('hex');
    
    const tx = new Transaction(myWalletAddress, to, amount);
    tx.sign(key);
    chain.newTransaction(tx);
    return;
}

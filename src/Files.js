const fs = require("fs");

const dir = './node/';

class Files {
    
    static createBlockChain(chain) {
        fs.readFile(`${dir}/00.txt`, function (err, data) {
            if (err || !data) {
                fs.writeFile(`${dir}/00.txt`,JSON.stringify(chain), function(err){
                    if(err) console.log(err.message);
                });
            }
            if (data) return;
        });
        return true;
    }

    static getGenesis () {
        const data = fs.readFileSync(`${dir}/00.txt`);
        const genesis = JSON.parse(data);
        return genesis;
    }

    static getCompleteChain() {
        let completeChain = this.getGenesis();
        const directories = fs.readdirSync(dir);
        directories.forEach(arquivo => {
            if (arquivo != "00.txt") {
                
                const data = fs.readFileSync(`${dir}/${arquivo}`);
                const block = JSON.parse(data);
                // console.log(block);
                completeChain.chain.push(block);
            }
            
        });
        return completeChain;
    }
    
}

module.exports.Files = Files;
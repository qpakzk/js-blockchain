const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "2018/01/01", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isCoinValid() {

        for(let i = 1; i < this.chain.length; i++) {
            let currentBlock = this.chain[i];
            let previousBlock = this.chain[i - 1];

            if(currentBlock.hash != currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let coin = new Blockchain();
coin.addBlock(new Block(1, "2018/01/02", { amount: 4 }));
coin.addBlock(new Block(2, "2018/01/05", { amount: 10 }));
console.log("Is a blockchain valid? " + coin.isCoinValid());

coin.chain[1].data = { amount : 100 };
coin.chain[1].hash = coin.chain[1].calculateHash();
coin.chain[2].previousHash = coin.chain[1].hash;
coin.chain[2].hash = coin.chain[2].calculateHash();
console.log("Is a blockchain valid? " + coin.isCoinValid());

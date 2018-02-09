const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("2018/01/01", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];

        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mind!");
        this.chain.push(block);
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress == address) {
                    balance -= trans.amount;
                }

                if(trans.toAddress == address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
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

console.log("\n Start the miner...");
coin.minePendingTransactions('frodo-address');

console.log("Balance of frodo is " + coin.getBalanceOfAddress('frodo-address'));

console.log("\n Start the miner again...");
coin.minePendingTransactions('frodo-address');

console.log("Balance of frodo is " + coin.getBalanceOfAddress('frodo-address'));

console.log("\n Start the miner again...");
coin.minePendingTransactions('frodo-address');

console.log("Balance of frodo is " + coin.getBalanceOfAddress('frodo-address'));

console.log("\n Sending Transactions...");
coin.createTransaction(new Transaction("frodo-address", "anna-address", 100));
coin.createTransaction(new Transaction("anna-address", "bob-address", 50));

console.log("Balance of frodo is " + coin.getBalanceOfAddress('frodo-address'));
console.log("Balance of anna is " + coin.getBalanceOfAddress('anna-address'));
console.log("Balance of bob is " + coin.getBalanceOfAddress('bob-address'));

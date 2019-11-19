const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const constants = require("./constants");
const database = require("./src/database/database")
const axios = require("axios")
const documentIndexerName = "indexer-status";
const common = require("./src/common");
const ethUtils = require("./src/ethereumUtils")
const uuid4 = require("uuid/v4")
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

async function polling(){
    const shouldQuit = false;
    const generalStatus = database.getGeneralStatusCollection()
    const addresses = database.getAddressesCollection();
    let config = await generalStatus.findOne({name: documentIndexerName})
    if(config === null){
        config = {
            name: documentIndexerName,
            next_block: 0,
            unconfirmedTransactions: [],
        }
        await generalStatus.insertOne(config)
    }
    let next_block = constants.initialBlock;
    while(!shouldQuit){
        const block = await web3.eth.getBlock(next_block);
        if(block === null){
            await common.sleep(1000);
        }else{
            next_block++;
            const transactions = await processBlock(block);
            let affectedTxs;
            let affectedAddresses;
            let txToInsert = [];
            if(block.transactions.length > 0){
                affectedTxs = await getAffectedTxs(transactions.txHashs);
                affectedAddresses = await getAffectedAddresses(transactions.addresses);
                for(const address in affectedAddresses){
                    for(const txHash of transactions.addresses[address]){
                        const tx = transactions.data[txHash];
                        let type;
                        if(tx.to == address){
                            type = "deposit";
                            const depositAmount = tx.amount - (2000000000*3000000);
                            console.log("FIRST CALCULATIO", depositAmount, tx.amount, (2000000000*3000000))
                            const depositAccount = await addresses.findOne({address: address});
                            await generateDeposit(address, constants.mainAddress, depositAmount, depositAccount, affectedAddresses[address])
                            txToInsert.push({
                                type: type,
                                amount: tx.amount,
                                from: tx.from,
                                to: tx.to,
                                user: affectedAddresses[address],
                                block: tx.block,
                                status: "confirmed",
                                txHash: txHash,})
                        }
                    }
                }
                if(affectedTxs.length > 0){
                    await confirmateTxs(affectedTxs);
                }
                if(txToInsert.length > 0){
                    await insertTxs(txToInsert);
                }
            }
            await generalStatus.updateOne({name: documentIndexerName},{$set:{
                next_block
            }})
        }
    }
}

async function processBlock(block){
    const transactions = {
        addresses: {},
        txHashs: [],
        data: {

        }
    };
    for(const txHash of block.transactions){
        await processTx(txHash, transactions);
    }
    return transactions;
}

async function processTx(txHash, transactions){
    const tx = await web3.eth.getTransaction(txHash);
    if(tx.to){
        tx.to = tx.to.toLowerCase();
    }
    if(tx.from){
        tx.from = tx.from.toLowerCase();
    }
    if(tx.from){
        if(transactions.addresses[tx.from]){
            transactions.addresses[tx.from].push(tx.hash);
        }else{
            transactions.addresses[tx.from] = [tx.hash];
        }
    }
    if(tx.to){
        if(transactions.addresses[tx.to]){
            transactions.addresses[tx.to].push(tx.hash);
        }else{
            transactions.addresses[tx.to] = [tx.hash];
        }
    }
    transactions.txHashs.push(tx.hash);
    transactions.data[tx.hash] = {
        from: tx.from,
        to: tx.to,
        amount: tx.value,
        gas: tx.gas,
        gasPrice: tx.gasPrice,
        block: tx.blockNumber,
    };
    return;
}

async function generateDeposit(fromAddress, toAddress, amount, account, user){
    const transactions = database.getTransactionsCollection()
    console.log("AMOUNT GENERATE DEPOSIT", amount)
    const depositTxHash = await ethUtils.transfer(fromAddress, toAddress, amount, account);
    await transactions.insertOne({
        fromUser: user,
        fromAddress: fromAddress,
        toAddress: toAddress,
        txID: uuid4(),
        txHash: depositTxHash,
        amount: amount,
        speed: "low",
        gasPrice: 5,
        gasLimit: 5,
        status: "unconfirmed",
        timestamp: Math.trunc(((new Date()).getTime())/1000),
    })
}

async function getAffectedAddresses(affectedAddresses){
    const addresses = database.getAddressesCollection()
    const arrayOfAddresses = [];
    for(const address in affectedAddresses){
        arrayOfAddresses.push(address)
    }
    const cursor = await addresses.aggregate([{$match: {address:{$in: arrayOfAddresses}}}]);
    const output = {};
    await cursor.forEach(function(item){
        output[item.address] = item.user
    })
    return output;
}

async function getAffectedTxs(affectedTransactions){
    const transactions = database.getTransactionsCollection();
    const cursor = await transactions.aggregate([{$match: {txHash:{$in: affectedTransactions}}}]);
    const output = [];
    await cursor.forEach(function(item){
        output.push(item.txHash);
    })
    return output;

}

async function confirmateTxs(affectedTxs){
    const transactions = database.getTransactionsCollection();
    const cursor = await transactions.aggregate([{$match: {txHash: {$in: affectedTxs}}}]);
    const transactionsData = [];
    await cursor.forEach(function(item){
        if(item){
            transactionsData.push(item);
        }
    });
    console.log(transactionsData)
    await transactions.updateMany({txHash:{$in: affectedTxs}}, {$set:{status: "confirmed"}});
    confirmeTransactionsInServer(transactionsData);
};

async function insertTxs(txToInsert){
    const transactions = database.getTransactionsCollection();
    await transactions.insertMany(txToInsert);
};

async function confirmeTransactionsInServer(transactions){
    const generalStatus = database.getGeneralStatusCollection();
    const promises = [];
    const failedConfirmations = [];
    for (const transaction of transactions) {
        promises.push(confirmateTxOnServer(transaction.txID, failedConfirmations));
    }
    await Promise.all(promises)
    if(failedConfirmations.length > 0){
        const generalStatusData = await findOne({name: documentIndexerName});
        await generalStatus.updateOne({name: documentIndexerName},{$set: {unconfirmedTransactions: generalStatusData.unconfirmedTransactions.concat(failedConfirmations)}})
    }
}


async function confirmateTxOnServer(txID, failedConfirmations){
    // const response = await axios.post("EL SERVER URL",{
    //     txID: txID
    // })
    // if(response.status = 200){
    //     return;
    // }
    // if(response.status = 404){
    //     failedConfirmations.push(txID)
    //     return;
    // }
}

module.exports = {
    polling
}
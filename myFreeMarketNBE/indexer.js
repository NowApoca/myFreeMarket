const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const constants = require("./constants");
const database = require("./src/database/database")

const documentIndexerName = "indexer-status";

web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));


async function sleep(milliseconds, cancel) {
	while (milliseconds > 0 && (!cancel.shouldQuit)) {
		const to_wait = (milliseconds > 300) ? 300 : milliseconds;
		await new Promise((resolve) => {
			setTimeout(resolve, to_wait);
		});
		milliseconds -= to_wait;
	}
}


async function polling(){
    const shouldQuit = false;
    const generalStatus = database.getGeneralStatusCollection()
    const config = await generalStatus.findOne({name: documentIndexerName})
    let next_block = constants.initialBlock;

    while(!shouldQuit){
        const block = await web3.eth.getBlock(next_block);
        if(block === null){
            await sleep(1000);
        }else{
            next_block++;
            const transactions = await processBlock(block);
            const affectedTxs = await getAffectedTxs(transactions.addresses);
            const txToInsert = [];
            const affectedAddresses = await getAffectedAddresses(transactions.addresses);
            for(const address in affectedAddresses){
                for(const txHash of transactions.addresses[address]){
                    const tx = transactions.data[txHash];
                    txToInsert.push({
                        type: (tx.to == address) ? "deposit" : "withdraw",
                        amount: tx.value,
                        from: tx.from,
                        to: tx.to,
                        user: affectedAddresses[address],
                        block: tx.blockNumber,
                        nonce: tx.nonce,
                    })
                }
            }
            await confirmateTxs(affectedTxs);
            await insertTxs(txToInsert);
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

async function getAffectedAddresses(addresses){
    const addresses = database.getAddressesCollection()
    const arrayOfAddresses = [];
    for(const address in addresses){
        arrayOfAddresses.push(address)
    }
    const cursor = await addresses.find({$match: {$in:{address: arrayOfAddresses}}});
    const output = {};
    await cursor.forEach(function(item){
        output[item.address] = item.mail
    })
    return output;
}

async function getAffectedTxs(transactions){
    const transactions = database.getTransactionsCollection();
    const cursor = await transactions.find({$match: {$in:{txHash: transactions}}});
    const output = [];
    await cursor.forEach(function(item){
        output.push(item.txHash);
    })
    return output;

}

async function confirmateTxs(affectedTxs){
    const transactions = database.getTransactionsCollection();
    const transactionsData = await transactions.find({$match: {$in: {txHash: affectedTxs}}});
    await transactions.update({$match: {$in:{txHash: affectedTxs}}, $set:{status: "confirmed"}});
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
    const response = await axios.post("EL SERVER URL",{
        txID: txID
    })
    if(response.status = 200){
        return;
    }
    if(response.status = 404){
        failedConfirmations.push(txID)
        return;
    }
}
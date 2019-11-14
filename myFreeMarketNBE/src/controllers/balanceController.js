const database = require("../database/database");
const uuidv4 = require('uuid/v4');
const ethereumUtils = require(__dirname + "/../ethereumUtils");

async function withdraw(req, res){
    const { toAddress, fromUser, txID, amount, speed } = res.locals;
    const addresses = database.getAddressesCollection();
    const transactions = database.getTransactionsCollection();
    const toUser = await addresses.findOne({address: toAddress});
    const txHash = await ethereumUtils.transfer();
    await transactions.insertOne({
        fromUser: fromUser,
		...(toUser !== null) && { toUser: toUser.mail },
        fromAddress: fromAddress,
        toAddress: toAddress,
        txID: txID,
        txHash: txHash,
        amount: amount,
        speed: speed,
        gasPrice: 5,
        gasLimit: 5,
        timestamp: Math.trunc(((new Date()).getTime())/1000),
    })
	res.status(200).json(txHash);
}

async function newDepositAddress(req, res){
    const { user} = res.locals;
    const addresses = database.getAddressesCollection();
    const newAddress = await ethereumUtils.generateNewAddress();
    await addresses.insertOne({
        address: newAddress,
        user: user,
        transactions: [],
        balance: 0,
        status: "enabled",
    })
	res.status(200).json("Done.");
}

// By the moment, I do not have clear if I should enable and disable deposit Addresses. Probably if the page ban someone.

async function disableDepositAddress(req, res){
    const { address } = res.locals;
    const addresses = database.getAddressesCollection();
    await addresses.updateOne({address: address},{$set: {status:"disabled"}})
	res.status(200).json(output);
}

async function enableDepositAddress(req, res){
    const { address } = res.locals;
    const addresses = database.getAddressesCollection();
    await addresses.updateOne({address: address},{$set: {status:"enabled"}})
	res.status(200).json(output);
}

module.exports = {
    withdraw,
    disableDepositAddress,
    enableDepositAddress,
    newDepositAddress,
}


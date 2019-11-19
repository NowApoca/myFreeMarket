const database = require("../database/database");
const uuidv4 = require('uuid/v4');
const ethereumUtils = require(__dirname + "/../ethereumUtils");
const constants = require("../../constants")

async function withdraw(req, res){
    const { toAddress, fromUser, txID, amount, speed } = res.locals;
    const addresses = database.getAddressesCollection();
    const transactions = database.getTransactionsCollection();
    const toUser = await addresses.findOne({address: toAddress});
    const txHash = await ethereumUtils.transfer(constants.mainAddress, toAddress, amount, mainAccount);
    await transactions.insertOne({
        fromUser: fromUser,
		...(toUser !== null) && { toUser: toUser.mail },
        fromAddress: constants.mainAddress,
        toAddress: toAddress,
        txID: txID,
        txHash: txHash,
        amount: amount,
        speed: speed,
        gasPrice: 5,
        gasLimit: 5,
        status: "unconfirmed",
        timestamp: Math.trunc(((new Date()).getTime())/1000),
    })
	res.status(200).json(txHash);
}

async function newUser(req, res){
    const { user }  = res.locals;
    const users = database.getUsersCollection();
    const generalStatus = database.getGeneralStatusCollection();
    const config = await generalStatus.findOne({name:"addresses-status"})
    await users.insertOne({
        addresses: [],
        accountId: config.next_accountId,
        mail: user,
        balance: 0
    })
	res.status(200).json("Done.");
}

async function newDepositAddress(req, res){
    const { user }  = res.locals;
    const addresses = database.getAddressesCollection();
    const users = database.getUsersCollection();
    const userAccount = await users.findOne({mail: user})
    const newAddress = await ethereumUtils.generateNewAddress(userAccount.accountId, userAccount.addresses.length);
    await addresses.insertOne({
        address: newAddress,
        user: user,
        transactions: [],
        balance: 0,
        status: "enabled",
        accountId: userAccount.accountId,
        addressId: userAccount.addresses.length,
    })
	res.status(200).json(newAddress);
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
    newUser,
}


const database = require(__dirname + "/../database/database");
const uuidv4 = require('uuid/v4');

async function getUserBalanceData(req, res){
    const { user } = res.local;
    const balances = database.getBalanceCollection()
    const balance = await balances.findOne({user: user.mail});
    res.status(200).json(balance)
}

async function getNetBalanceData(req, res){
    const balances = database.getBalanceCollection()
    const balance = await balances.findOne({user: "net"});
    res.status(200).json(balance)
}

async function getUserMovements(req, res){
    const { user } = res.local;
    const balances = database.getBalanceCollection()
    const balance = await balances.findOne({user: user.mail});
    res.status(200).json({
        movements: balance[req.body.dataRequested],
    })
}

async function getUserMovements(req, res){
    const { user } = res.local;
    const balances = database.getBalanceCollection()
    const balance = await balances.findOne({user: user.mail});
    res.status(200).json({
        movements: balance[req.body.dataRequested],
    })
}

async function withdraw(req, res){
    const { user, toAddress } = res.local;
    const balances = database.getBalanceCollection()
    const accounts = database.getAccountsCollection()
    const balance = await balances.findOne({user: user.mail});
    if(balance.balance < ((parseInt(req.body.amount)+ 100/*fee*/))){
        balance.
        res.status(400).json("Amount of tx is bigger than user balance.");    
    }
    await balances.updateOne({user: user.mail},{$inc:{balance: -((parseInt(req.body.amount)+ 100/*fee*/))}});
    const toAddress = await accounts.findOne({address: toAddress});
    if(toAddress){
        await accounts.updateOne({address: toAddress}, {$inc:{balance: ((parseInt(req.body.amount)))}})
    }else{
        /*
            make tx, receive here the txid and save the hash in tx table and return the tx id.    
        */
    }
    res.status(200).json("Done.");
}

async function changeAddressNote(req, res){
    const { toAddress } = res.local;
    const accounts = database.getAccountsCollection()
    await accounts.updateOne({address: toAddress},{$set:{note: req.body.note}})
    res.status(200).json("Done.");
}

async function deposit(req, res){
    const txs = database.getTxsCollection()
    await txs.insertOne({
        txID: req.body.txID,
        amount: req.body.amount,
        depositAddress: req.body.depositAddress,
        status: "pending"
    })
    res.status(200).json("Done.");
}

async function confirmeDeposit(req, res){
    const { toAddress } = res.local;
    const balances = database.getBalanceCollection();
    const accounts = database.getAccountsCollection()
    const txs = database.getTxsCollection()
    const tx = await txs.findOne({txID: req.body.txID})
    await txs.updateOne({txID: req.body.txID},{$set:{status: "confirmated"}})
    const account = await accounts.findOne({address: toAddress})
    const balance = await balances.findOne({user: account.user})
    await balances.updateOne({mail: account.user},{$set:{balance: (balance.balance + parseInt(req.body.amount)), movements : (balance.movements.push(tx))}})
    res.status(200).json("Done.");
}

module.exports = {
    getUserBalanceData,
    getNetBalanceData,
    getUserMovements,
    changeAddressNote,
    withdraw,
    deposit,
    confirmeDeposit,
}


const { initialize } = require(__dirname + "/../index");
const database = require(__dirname + "/../src/database/database");
const settings = require(__dirname + "/./config.json");
const axios = require("axios");
const uuid4 = require("uuid/v4");
const expect = require('expect');
const common = require("./common")
const { sendTx } = require("../testBlockchain")
const constants = require("../constants")

before(() => {
  return new Promise((resolve) => {
    initialize(settings);
    setTimeout(() => {
      resolve();
    }, 5000);
  });
});

describe('Addresses operations', function() {

    it('Create new user', async () => {
        await dropDatabase();
        const users = database.getUsersCollection();
        const user = {
            user: uuid4()
        }
        const result = await axios.post("http://localhost:" + settings.port + "/balance/add/user", user)
        expect(result.status).toEqual(200)
        const userRegistered = await users.findOne({mail: user.user});
        expect(userRegistered.addresses).toEqual([]);
        expect(result.data).toEqual("Done.");
    });

    it('Create new deposit address', async () => {
        await dropDatabase();
        const addresses = database.getAddressesCollection();
        const user = {
            user: uuid4()
        }
        const resultPost1 = await axios.post("http://localhost:" + settings.port + "/balance/add/user", user)
        expect(resultPost1.status).toEqual(200)
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/balance/add/deposit/address", user)
        expect(resultPost2.status).toEqual(200)
        const account = await addresses.findOne({address: resultPost2.data});
        expect(account.address).toEqual(resultPost2.data);
    });

    it('Create new withdraw', async () => {
        await dropDatabase();
        const users = database.getUsersCollection();

        const user = {
            user: uuid4()
        }
        const result = await axios.post("http://localhost:" + settings.port + "/balance/add/user", user)
        expect(result.status).toEqual(200)
        const userRegistered = await users.findOne({mail: user.user});
        expect(userRegistered.addresses).toEqual([]);
        expect(result.data).toEqual("Done.");

        const transactions = database.getTransactionsCollection()
        const txTransfer = {
            toAddress: "0x3bc2798FcAF5D24aa234d58cB436Adf7cA4152e2",
            fromUser: user.user,
            txID: uuid4(),
            amount: "100",
            speed: "fast",
        }
        const result2 = await axios.post("http://localhost:" + settings.port + "/balance/withdraw", txTransfer);
        expect(result2.status).toEqual(200);
        expect(/^0x([A-Fa-f0-9]{64})$/.test(result2.data)).toEqual(true);
        await common.sleep(500)
        const confirmedTx = await transactions.findOne({txHash: result2.data})
        expect(confirmedTx.status).toEqual("confirmed")
    });

    it('Create new withdraw to invalid address', async () => {
        await dropDatabase();
        
        const users = database.getUsersCollection();

        const user = {
            user: uuid4()
        }
        const result = await axios.post("http://localhost:" + settings.port + "/balance/add/user", user)
        expect(result.status).toEqual(200)
        const userRegistered = await users.findOne({mail: user.user});
        expect(userRegistered.addresses).toEqual([]);
        expect(result.data).toEqual("Done.");

        const txTransfer = {
            toAddress: "0x3bc2798Z23F5D24aa234d58cB436Adf7cA4152e2",
            fromUser: user.user,
            txID: uuid4(),
            amount: "100",
            speed: "fast",
        }
        const result2 = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/balance/withdraw", txTransfer));
        expect(result2.status).toEqual(400);
        expect(result2.e).toEqual("Invalid 'to' address. Try again.");
    });

    it('Create new withdraw negative', async () => {
        await dropDatabase();
        
        const users = database.getUsersCollection();

        const user = {
            user: uuid4()
        }
        const result = await axios.post("http://localhost:" + settings.port + "/balance/add/user", user)
        expect(result.status).toEqual(200)
        const userRegistered = await users.findOne({mail: user.user});
        expect(userRegistered.addresses).toEqual([]);
        expect(result.data).toEqual("Done.");

        const txTransfer = {
            toAddress: "0x3bc2798FcAF5D24aa234d58cB436Adf7cA4152e2",
            fromUser: user.user,
            txID: uuid4(),
            amount: "-100",
            speed: "fast",
        }
        const result2 = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/balance/withdraw", txTransfer));
        expect(result2.status).toEqual(400);
        expect(result2.e).toEqual("Amount must be greater than '0'.");
    });

    it('Create new withdraw with minus amoount that minimal amount of tx', async () => {
        await dropDatabase();
        
        const users = database.getUsersCollection();

        const user = {
            user: uuid4()
        }
        const result = await axios.post("http://localhost:" + settings.port + "/balance/add/user", user)
        expect(result.status).toEqual(200)
        const userRegistered = await users.findOne({mail: user.user});
        expect(userRegistered.addresses).toEqual([]);
        expect(result.data).toEqual("Done.");

        const txTransfer = {
            toAddress: "0x3bc2798FcAF5D24aa234d58cB436Adf7cA4152e2",
            fromUser: user.user,
            txID: uuid4(),
            amount: (constants.minWithdraw != 0) ? constants.minWithdraw-1 : 0,
            speed: "fast",
        }
        const result2 = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/balance/withdraw", txTransfer));
        expect(result2.status).toEqual(400);
        expect(result2.e).toEqual("Amount must be greater than '"+constants.minWithdraw+"'.");
    });

    it('Create new withdraw with invalid speed', async () => {
        await dropDatabase();
        const users = database.getUsersCollection();

        const user = {
            user: uuid4()
        }
        const result = await axios.post("http://localhost:" + settings.port + "/balance/add/user", user)
        expect(result.status).toEqual(200)
        const userRegistered = await users.findOne({mail: user.user});
        expect(userRegistered.addresses).toEqual([]);
        expect(result.data).toEqual("Done.");

        const txTransfer = {
            toAddress: "0x3bc2798FcAF5D24aa234d58cB436Adf7cA4152e2",
            fromUser: user.user,
            txID: uuid4(),
            amount: constants.minWithdraw+1,
            speed: "faster",
        }
        const result2 = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/balance/withdraw", txTransfer));
        expect(result2.status).toEqual(400);
        expect(result2.e).toEqual("Not valid speed.");
    });

    it('Create new withdraw with invalid speed', async () => {
        await dropDatabase();
        const users = database.getUsersCollection();

        const user = {
            user: uuid4()
        }
        const result = await axios.post("http://localhost:" + settings.port + "/balance/add/user", user)
        expect(result.status).toEqual(200)
        const userRegistered = await users.findOne({mail: user.user});
        expect(userRegistered.addresses).toEqual([]);
        expect(result.data).toEqual("Done.");

        const txTransfer = {
            toAddress: "0x3bc2798FcAF5D24aa234d58cB436Adf7cA4152e2",
            fromUser: user.user+"FAIL",
            txID: uuid4(),
            amount: constants.minWithdraw+1,
            speed: "fast",
        }
        const result2 = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/balance/withdraw", txTransfer));
        expect(result2.status).toEqual(400);
        expect(result2.e).toEqual("Not existing user.");
    });
    
    it('Deposit to an address', async () => {
        await dropDatabase();
        const addresses = database.getAddressesCollection();
        const transactions = database.getTransactionsCollection()
        const user = {
            user: uuid4()
        }
        const resultPost1 = await axios.post("http://localhost:" + settings.port + "/balance/add/user", user)
        expect(resultPost1.status).toEqual(200)
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/balance/add/deposit/address", user)
        expect(resultPost2.status).toEqual(200)
        const account = await addresses.findOne({address: resultPost2.data});
        expect(account.address).toEqual(resultPost2.data);
        await common.sleep(500)
        const fromAddress = "0x7f1af8256f92fab89344813441338db0490349fd";
        const fromPrivKey = "86f55b7df5b890c31babcf6875356d0a9f95ce03853935aff85efcc06eca1d83";
        const hash = await sendTx(fromAddress, account.address, fromPrivKey)
        await common.sleep(1500)
        const transactionDeposit = await transactions.findOne({txHash: hash})
        expect(transactionDeposit.to).toEqual(account.address)
        expect(transactionDeposit.status).toEqual("confirmed")
        const depositAddress = await addresses.findOne({address: account.address})
        const txDepositedHash = depositAddress.transactions[0].txHash;
        const txDeposited = await transactions.findOne({txHash: txDepositedHash})
        expect(txDeposited.status).toEqual("confirmed")
    });

});

async function dropDatabase(){
    const db = database.getDb();
    await db.dropDatabase(settings.dbName)
    await database.initialize("mongo", settings);
}
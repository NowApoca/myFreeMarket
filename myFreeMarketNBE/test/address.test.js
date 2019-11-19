const { initialize } = require(__dirname + "/../index");
const database = require(__dirname + "/../src/database/database");
const settings = require(__dirname + "/./config.json");
const axios = require("axios");
const uuid4 = require("uuid/v4");
const expect = require('expect');
const common = require("./common")
const { sendTx } = require("../testBlockchain")

before(() => {
  return new Promise((resolve) => {
    initialize(settings);
    setTimeout(() => {
      resolve();
    }, 5000);
  });
});

describe('Products Controller', function() {

    // it('Create new user', async () => {
    //     await dropDatabase();
    //     const users = database.getUsersCollection();
    //     const user = {
    //         user: uuid4()
    //     }
    //     const result = await axios.post("http://localhost:" + settings.port + "/balance/add/user", user)
    //     expect(result.status).toEqual(200)
    //     const userRegistered = await users.findOne({mail: user.user});
    //     expect(userRegistered.accountId).toEqual(1);
    //     expect(userRegistered.addresses).toEqual([]);
    //     expect(result.data).toEqual("Done.");
    // });

    // it('Create new deposit address', async () => {
    //     await dropDatabase();
    //     const addresses = database.getAddressesCollection();
    //     const user = {
    //         user: uuid4()
    //     }
    //     const resultPost1 = await axios.post("http://localhost:" + settings.port + "/balance/add/user", user)
    //     expect(resultPost1.status).toEqual(200)
    //     const resultPost2 = await axios.post("http://localhost:" + settings.port + "/balance/add/deposit/address", user)
    //     expect(resultPost2.status).toEqual(200)
    //     const account = await addresses.findOne({address: resultPost2.data});
    //     expect(account.address).toEqual(resultPost2.data);
    // });

    // it('Create new withdraw', async () => {
    //     await dropDatabase();
    //     const transactions = database.getTransactionsCollection()
    //     const txTransfer = {
    //         toAddress: "0x3bc2798FcAF5D24aa234d58cB436Adf7cA4152e2",
    //         fromUser: "123",
    //         txID: uuid4(),
    //         amount: "100",
    //         speed: "fast",
    //     }
    //     const result = await axios.post("http://localhost:" + settings.port + "/balance/withdraw", txTransfer);
    //     expect(result.status).toEqual(200);
    //     expect(/^0x([A-Fa-f0-9]{64})$/.test(result.data)).toEqual(true);
    //     await common.sleep(500)
    //     const confirmedTx = await transactions.findOne({txHash: result.data})
    //     expect(confirmedTx.status).toEqual("confirmed")
    // });


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
        const fromAddress = "0xf08af1f662ecc2e795161a85f09fa5067db7d6af";
        const fromPrivKey = "c960c3508c4a73e189b9ec0599f6382f18aacbcd9274bf181702f1a7c4f30e24";
        const hash = await sendTx(fromAddress, account.address, fromPrivKey)
        console.log(account.address, hash)
    });

});

async function dropDatabase(){
    const db = database.getDb();
    await db.dropDatabase(settings.dbName)
    await database.initialize("mongo", settings);
}
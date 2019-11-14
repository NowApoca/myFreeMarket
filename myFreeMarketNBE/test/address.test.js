const { initialize } = require(__dirname + "/../index");
const database = require(__dirname + "/../src/database/database");
const settings = require(__dirname + "/./config.json");
const axios = require("axios");
const uuid4 = require("uuid/v4");
const expect = require('expect');
const common = require("./common")

before(() => {
  return new Promise((resolve) => {
    initialize(settings);
    setTimeout(() => {
      resolve();
    }, 5000);
  });
});

describe('Products Controller', function() {

    it('Create new deposit address', async () => {
        await dropDatabase();
        const user = {
            user: "123"
        }
        const result = await axios.post("http://localhost:" + settings.port + "/balance/add/deposit/address", user)
    });

    it('Create new withdraw', async () => {
        await dropDatabase();
        const txTransfer = {
            toAddress: "0x3bc2798FcAF5D24aa234d58cB436Adf7cA4152e2",
            fromUser: "123",
            txID: uuid4(),
            amount: "100",
            speed: "fast",
        }
        const result = await axios.post("http://localhost:" + settings.port + "/balance/withdraw", txTransfer)
        console.log(result)
    });
});

async function dropDatabase(){
    const db = database.getDb();
    await db.dropDatabase(settings.dbName)
    await database.initialize("mongo", settings);
}
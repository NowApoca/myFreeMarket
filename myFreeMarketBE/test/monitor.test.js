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


describe('Log in Controller', function() {
    it('Test Ping', async () => {
        const result = await axios.get("http://localhost:3010/ping");
        expect(result.data).toEqual(true);
    });
});

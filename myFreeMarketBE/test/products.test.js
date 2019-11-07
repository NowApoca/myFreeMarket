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

describe('Log Controller', function() {
    it('Log in with an invalid password three times', async () => {
        let user = {
            name: uuid4(),
            lastName: uuid4(),
            mail: uuid4(),
            password: uuid4()
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/logup", user);
        expect(resultPost.data.result).toEqual("DONE");
        expect(resultPost.status).toEqual(200);
        const users = database.getUsersCollection();
        const resultGet = await users.findOne({name: user.name})
        expect(resultGet.mail).toEqual(user.mail);
        user.password = "Invalid Password";
        let resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/login", user));
        expect(resultError.e).toEqual("Invalid Mail or Password.")
        expect(resultError.status).toEqual(404)
        resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/login", user));
        expect(resultError.e).toEqual("Invalid Mail or Password.")
        expect(resultError.status).toEqual(404)
        resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/login", user));
        expect(resultError.e).toEqual("Blocked Account.")
        expect(resultError.status).toEqual(404)
    });
    
});
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
    
    it('Publish a complain', async () => {
        await dropDatabase();
        const user = await createUser();
        const complains = await database.getComplainsCollection();
        const complainObj = {
            colour: "red",
            text: " My pay did not test",
            tag: "Pays",
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/complain/new/user/"+user.mail, complainObj)
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const complain = await complains.findOne({complainer: user.mail});
        expect(complain.complainer).toEqual(user.mail);
        expect(complain.status).toEqual("unsolved");
        expect(complain.helper).toEqual("");
        expect(complain.tag).toEqual(complainObj.tag);
        expect(complain.text).toEqual(complainObj.text);
        expect(complain.colour).toEqual(complainObj.colour);
    });
});

async function createUser(){
    const user = {
        name: uuid4(),
        lastName: uuid4(),
        mail: uuid4(),
        password: uuid4()
    }
    await axios.post("http://localhost:" + settings.port + "/logup", user);
    return user;
}

async function dropDatabase(){
    const db = database.getDb();
    await db.dropDatabase(settings.dbName)
    await database.initialize("mongo", settings);
}
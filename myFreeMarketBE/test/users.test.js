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
    
    it('Get products of an user', async () => {
        await dropDatabase();
        const user = await createUser();
        const user2 = await createUser();
        const product = {
            productName: uuid4(),
            price: 30,
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            productKey: uuid4(),
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const product2 = {
            productName: uuid4(),
            price: 60,
            initialStock: 20,
            description: uuid4(),
            dues: 6,
            owner: user2.mail,
            productKey: uuid4(),
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        await createProduct(product)
        await createProduct(product)
        await createProduct(product)
        await createProduct(product2)
        const userProducts = await axios.get("http://localhost:" + settings.port + "/user/"+user.mail+"/products")
        expect(userProducts.status).toEqual(200);
        expect(userProducts.data.length).toEqual(3);
    });

    it('Get [] products of an user if he does not have products', async () => {
        await dropDatabase();
        const user = await createUser();
        const user2 = await createUser();
        const product2 = {
            productName: uuid4(),
            price: 60,
            initialStock: 20,
            description: uuid4(),
            dues: 6,
            owner: user2.mail,
            productKey: uuid4(),
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        await createProduct(product2)
        const userProducts = await axios.get("http://localhost:" + settings.port + "/user/"+user.mail+"/products")
        expect(userProducts.status).toEqual(200);
        expect(userProducts.data.length).toEqual(0);
        expect(userProducts.data).toEqual([]);
    });

    it('Throw 404 if user does not exist', async () => {
        await dropDatabase();
        const user = await createUser();
        const user2 = await createUser();
        const product2 = {
            productName: uuid4(),
            price: 60,
            initialStock: 20,
            description: uuid4(),
            dues: 6,
            owner: user2.mail,
            productKey: uuid4(),
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        await createProduct(product2)
        const resultError = await common.getErrorAsyncRequest(axios.get("http://localhost:" + settings.port + "/user/"+user.mail+5+"/products"));
        expect(resultError.status).toEqual(404);
        expect(resultError.e).toEqual("User does not exist.");
    });

    it('Get user sales', async () => {
        await dropDatabase();
        const users = database.getUsersCollection();
        const seller = await createUser();
        const purchaser = await createUser();
        const product = {
            productName: uuid4(),
            price: 30,
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: seller.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultPurchase = await axios.post("http://localhost:" + settings.port + "/product/purchase/"+resultPost.data+"/"+purchaser.mail);
        expect(resultPurchase.status).toEqual(200);
        const userSeller = await users.findOne({mail: seller.mail});
        const userPurchaser = await users.findOne({mail: purchaser.mail});
        expect(userSeller.balance).toEqual(130);
        expect(userPurchaser.balance).toEqual(70);
        expect(userSeller.sales.indexOf(resultPost.data)).toBeGreaterThanOrEqual(0);
        expect(userPurchaser.purchases.indexOf(resultPost.data)).toBeGreaterThanOrEqual(0);
        const resultGet = await axios.get("http://localhost:" + settings.port + "/user/"+seller.mail+"/products/movements/sales")
        expect(product.productName).toEqual(resultGet.data[0].productName);
        expect(resultGet.status).toEqual(200);
    });

    it('Get user sales empty', async () => {
        await dropDatabase();
        const seller = await createUser();
        const resultGet = await axios.get("http://localhost:" + settings.port + "/user/"+seller.mail+"/products/movements/sales")
        expect(resultGet.data).toEqual([]);
        expect(resultGet.status).toEqual(200);
    });


    it('Get user purchases', async () => {
        await dropDatabase();
        const users = database.getUsersCollection();
        const seller = await createUser();
        const purchaser = await createUser();
        const product = {
            productName: uuid4(),
            price: 30,
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: seller.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultPurchase = await axios.post("http://localhost:" + settings.port + "/product/purchase/"+resultPost.data+"/"+purchaser.mail);
        expect(resultPurchase.status).toEqual(200);
        const userSeller = await users.findOne({mail: seller.mail});
        const userPurchaser = await users.findOne({mail: purchaser.mail});
        expect(userSeller.balance).toEqual(130);
        expect(userPurchaser.balance).toEqual(70);
        expect(userSeller.sales.indexOf(resultPost.data)).toBeGreaterThanOrEqual(0);
        expect(userPurchaser.purchases.indexOf(resultPost.data)).toBeGreaterThanOrEqual(0);
        const resultGet = await axios.get("http://localhost:" + settings.port + "/user/"+purchaser.mail+"/products/movements/purchases")
        expect(product.productName).toEqual(resultGet.data[0].productName);
        expect(resultGet.status).toEqual(200);
    });

    it('Get user purchases empty', async () => {
        await dropDatabase();
        const purchaser = await createUser();
        const resultGet = await axios.get("http://localhost:" + settings.port + "/user/"+purchaser.mail+"/products/movements/purchases")
        expect(resultGet.data).toEqual([]);
        expect(resultGet.status).toEqual(200);
    });

    it('Set a fav product to a user and get favs products', async () => {
        await dropDatabase();
        const products = database.getProductsCollection();
        const seller = await createUser();
        const purchaser = await createUser();
        const product = {
            productName: uuid4(),
            price: 30,
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: seller.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        const productPublished = await products.findOne({owner: seller.mail});
        expect(resultPost.status).toEqual(200);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/user/"+purchaser.mail+"/fav/product/action/fav/"+productPublished.productKey);
        expect(resultPost2.status).toEqual(200);
        const resultGet = await axios.get("http://localhost:" + settings.port + "/user/"+purchaser.mail+"/fav/products");
        expect(resultGet.status).toEqual(200);
        expect(resultGet.data[0].productName).toEqual(product.productName);
    });

    it('Get empty fav products from user', async () => {
        await dropDatabase();
        const user = await createUser();
        const resultGet = await axios.get("http://localhost:" + settings.port + "/user/"+user.mail+"/fav/products");
        expect(resultGet.status).toEqual(200);
        expect(resultGet.data).toEqual([]);
    });

    it('Fav a not existing user', async () => {
        await dropDatabase();
        const user = await createUser();
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/user/"+user.mail+"/fav/seller/action/fav/"+345));
        expect(resultError.status).toEqual(404);
        expect(resultError.e).toEqual("No existing user.");
    });

    it('Get user Data', async () => {
        await dropDatabase();
        const user = await createUser();
        const resultGet = await axios.get("http://localhost:" + settings.port + "/user/"+user.mail+"/data");
        expect(resultGet.status).toEqual(200);
        expect(resultGet.data).toEqual({
            balance: 100,
            name: user.name,
            mail: user.mail
        });
    });

    it('Fav a seller user that does not exist', async () => {
        await dropDatabase();
        const user = await createUser();
        const user2 = await createUser();
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/user/"+user.mail+"/fav/seller/action/fav/"+user2.mail+4));
        expect(resultError.status).toEqual(404);
        expect(resultError.e).toEqual("No existing user.");
    });

    it('Fav a seller user', async () => {
        await dropDatabase();
        const user = await createUser();
        const user2 = await createUser();
        const resultGet = await axios.post("http://localhost:" + settings.port + "/user/"+user.mail+"/fav/seller/action/fav/"+user2.mail);
        expect(resultGet.status).toEqual(200);
        expect(resultGet.data).toEqual("Done.");
        const users = database.getUsersCollection();
        const userUpdated = await users.findOne({mail: user.mail});
        expect(userUpdated.favSellers).toEqual([user2.mail]);
    });

    it('Change password', async () => {
        await dropDatabase();
        const user = await createUser();
        const password = "newpassword";
        const resultPost = await axios.post("http://localhost:" + settings.port + "/user/"+user.mail+"/change/password",{
            newPassword: password,
        });
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const users = database.getUsersCollection();
        const userUpdated = await users.findOne({mail: user.mail});
        expect(userUpdated.password).toEqual(password);
        expect(userUpdated.historicPasswords).toEqual([user.password, password]);
    });

    it('Change password and repeat it', async () => {
        await dropDatabase();
        const user = await createUser();
        const password = "newpassword";
        const resultPost = await axios.post("http://localhost:" + settings.port + "/user/"+user.mail+"/change/password",{
            newPassword: password,
        });
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const users = database.getUsersCollection();
        const userUpdated = await users.findOne({mail: user.mail});
        expect(userUpdated.password).toEqual(password);
        expect(userUpdated.historicPasswords).toEqual([user.password, password]);

        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/user/"+user.mail+"/change/password",{
            newPassword: password,
        }));
        expect(resultError.status).toEqual(404);
        expect(resultError.e).toEqual("Password already used.");
    });

    it('Change description', async () => {
        await dropDatabase();
        const user = await createUser();
        const description = "new decription";
        const resultPost = await axios.post("http://localhost:" + settings.port + "/user/"+user.mail+"/change/description",{
            description: description,
        });
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const users = database.getUsersCollection();
        const userUpdated = await users.findOne({mail: user.mail});
        expect(userUpdated.description).toEqual(description);
    });

    it('Change level', async () => {
        await dropDatabase();
        const users = database.getUsersCollection();
        const user = await createUser();
        await users.updateOne({mail: user.mail},{"$set":{level: 4}})
        const resultPost = await axios.post("http://localhost:" + settings.port + "/user/"+user.mail+"/change/level/" + 1);
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const userUpdated = await users.findOne({mail: user.mail});
        expect(userUpdated.level).toEqual(1);
    });

    it('Change level with a non level account', async () => {
        await dropDatabase();
        const users = database.getUsersCollection();
        const user = await createUser();
        const resultPost = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/user/"+user.mail+"/change/level/" + 1));
        expect(resultPost.status).toEqual(404);
        expect(resultPost.e).toEqual("User has not enough level account.");
        const userUpdated = await users.findOne({mail: user.mail});
        expect(userUpdated.level).toEqual(0);
    });

    it('Ban user', async () => {
        await dropDatabase();
        const users = database.getUsersCollection();
        const user = await createUser();
        const user2 = await createUser();
        await users.updateOne({mail: user.mail},{"$set":{level: 4}})
        const resultPost = await axios.post("http://localhost:" + settings.port + "/user/"+user.mail+"/ban/" + user2.mail, {
            expirationBan: Math.trunc((new Date()).getTime()/1000),
            reason: "For Testing",
            banned: user2.mail,
        });
        expect(resultPost.status).toEqual(200);
        expect(resultPost.data).toEqual("Done.");
        const userUpdated = await users.findOne({mail: user2.mail});
        expect(userUpdated.status).toEqual({
            available: false,
            expirationBan: Math.trunc((new Date()).getTime()/1000),
            reason: "For Testing",
            banned: user2.mail,
        });
    });

    it('Ban user with a non level account', async () => {
        await dropDatabase();
        const user = await createUser();
        const user2 = await createUser();
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/user/"+user.mail+"/ban/" + user2.mail, {
            expirationBan: Math.trunc((new Date()).getTime()/1000),
            reason: "For Testing",
            banned: user2.mail,
        }));
        expect(resultError.status).toEqual(404);
        expect(resultError.e).toEqual("User has not enough level account.");
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

async function createProduct(productParameters){
    await axios.post("http://localhost:" + settings.port + "/publish", productParameters);
    return;
}

async function dropDatabase(){
    const db = database.getDb();
    await db.dropDatabase(settings.dbName)
    await database.initialize("mongo", settings);
}
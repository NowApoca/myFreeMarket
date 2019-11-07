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

    it('Publish a product', async () => {
        await dropDatabase();
        const user = await createUser();
        const products = database.getProductsCollection();
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
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product)
        expect(resultPost.status).toEqual(200)
        const productGet = await products.findOne({productKey: resultPost.data})
        expect(productGet.productName).toEqual(product.productName);
        expect(productGet.price).toEqual(product.price);
        expect(productGet.initialStock).toEqual(product.initialStock);
        expect(productGet.description).toEqual(product.description);
        expect(productGet.owner).toEqual(user.mail);
    });
    
    it('Publish a product without numbers', async () => {
        await dropDatabase();
        const user = await createUser();
        const products = database.getProductsCollection();
        const product = {
            productName: uuid4(),
            price: "WRONG PRICE FORMAT fourteen",
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            productKey: uuid4(),
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/publish", product));
        expect(resultError.status).toEqual(404)
        expect(resultError.e).toEqual("Parameter 'price' must be a number.");
    });
    
    it('Publish a product without numbers', async () => {
        await dropDatabase();
        const user = await createUser();
        const products = database.getProductsCollection();
        const product = {
            productName: uuid4(),
            price: "WRONG PRICE FORMAT fourteen",
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            productKey: uuid4(),
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/publish", product));
        expect(resultError.status).toEqual(404)
        expect(resultError.e).toEqual("Parameter 'price' must be a number.");
    });
    
    it('Publish products and get them', async () => {
        await dropDatabase();
        const user = await createUser();
        const productsToPush = [];
        for(let i = 0; i < 5 ;i++){
            productsToPush.push({
                productName: uuid4(),
                price: Math.trunc(Math.random() * (100 - 1) + 1),
                initialStock: 15,
                description: uuid4(),
                dues: 3,
                owner: user.mail,
                productKey: uuid4(),
                timestamp: Math.trunc((new Date()).getTime()/1000),
            })
            await axios.post("http://localhost:" + settings.port + "/publish", productsToPush[i])
        }
        const resultGet = await axios.get("http://localhost:" + settings.port + "/products");
        expect(resultGet.status).toEqual(200);
        expect(resultGet.data.length).toEqual(5);
        let n = 0;
        for(let product of resultGet.data){
            expect(product.productName).toEqual(productsToPush[n].productName);
            expect(product.price).toEqual(productsToPush[n].price);
            expect(product.initialStock).toEqual(productsToPush[n].initialStock);
            expect(product.description).toEqual(productsToPush[n].description);
            expect(product.owner).toEqual(productsToPush[n].owner);
            expect(product.status).toEqual("available");
            n++;
        }
    });
    
    it('Publish products and there are not products available.', async () => {
        await dropDatabase();
        const resultError = await common.getErrorAsyncRequest(axios.get("http://localhost:" + settings.port + "/products"));
        expect(resultError.status).toEqual(400);
        expect(resultError.e).toEqual("No products available.");
    });
    
    it('Publish a product and request it', async () => {
        await dropDatabase();
        const user = await createUser();
        const product = {
            productName: uuid4(),
            price: 30,
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultGet = (await axios.get("http://localhost:" + settings.port + "/product/"+resultPost.data));
        expect(product.productName).toEqual(resultGet.data.productName);
        expect(product.price).toEqual(resultGet.data.price);
        expect(product.initialStock).toEqual(resultGet.data.initialStock);
        expect(product.description).toEqual(resultGet.data.description);
        expect(product.owner).toEqual(resultGet.data.owner);
    });

    it('Publish a product and request it when it does not exist', async () => {
        await dropDatabase();
        const user = await createUser();
        const product = {
            productName: uuid4(),
            price: 30,
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultError = await common.getErrorAsyncRequest(axios.get("http://localhost:" + settings.port + "/product/"+resultPost.data+5));
        expect(resultError.status).toEqual(404);
        expect(resultError.e).toEqual("Product with id '"+ resultPost.data + 5 +"' does not exist.");
    });

    it('Pause a product', async () => {
        await dropDatabase();
        const products = database.getProductsCollection();
        const user = await createUser();
        const product = {
            productName: uuid4(),
            price: 30,
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/product/pause/"+resultPost.data);
        expect(resultPost2.status).toEqual(200);
        const productPaused = await products.findOne({productKey: resultPost.data})
        expect(productPaused.status).toEqual("paused");
    });
    
    it('UnPause a product', async () => {
        await dropDatabase();
        const products = database.getProductsCollection();
        const user = await createUser();
        const product = {
            productName: uuid4(),
            price: 30,
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/product/pause/"+resultPost.data);
        expect(resultPost2.status).toEqual(200);
        const productPaused = await products.findOne({productKey: resultPost.data})
        expect(productPaused.status).toEqual("paused");
        const resultPost3 = await axios.post("http://localhost:" + settings.port + "/product/unpause/"+resultPost.data);
        expect(resultPost3.status).toEqual(200);
        const productUnpaused = await products.findOne({productKey: resultPost.data})
        expect(productUnpaused.status).toEqual("available");
    });

    it('Delete a product', async () => {
        await dropDatabase();
        const products = database.getProductsCollection();
        const user = await createUser();
        const product = {
            productName: uuid4(),
            price: 30,
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/product/delete/"+resultPost.data);
        expect(resultPost2.status).toEqual(200);
        const productDeleted = await products.findOne({productKey: resultPost.data})
        expect(productDeleted).toEqual(null);
    });


    it('Pause a product that does not exist', async () => {
        await dropDatabase();
        const products = database.getProductsCollection();
        const user = await createUser();
        const product = {
            productName: uuid4(),
            price: 30,
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/product/pause/"+resultPost.data+5));
        expect(resultError.e).toEqual("Product with id '"+resultPost.data+5 +"' does not exist.")
        expect(resultError.status).toEqual(404);
    });
    
    it('UnPause a product that does not exist', async () => {
        await dropDatabase();
        const products = database.getProductsCollection();
        const user = await createUser();
        const product = {
            productName: uuid4(),
            price: 30,
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultPost2 = await axios.post("http://localhost:" + settings.port + "/product/pause/"+resultPost.data);
        expect(resultPost2.status).toEqual(200);
        const productPaused = await products.findOne({productKey: resultPost.data})
        expect(productPaused.status).toEqual("paused");
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/product/unpause/"+resultPost.data+5));
        expect(resultError.e).toEqual("Product with id '"+resultPost.data+5 +"' does not exist.")
        expect(resultError.status).toEqual(404);
    });

    it('Delete a product that does not exist', async () => {
        await dropDatabase();
        const products = database.getProductsCollection();
        const user = await createUser();
        const product = {
            productName: uuid4(),
            price: 30,
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/product/delete/"+resultPost.data+5));
        expect(resultError.status).toEqual(404);
        expect(resultError.e).toEqual("Product with id '"+ resultPost.data+5 +"' does not exist.")
    });

    it('Purchase between 2 users', async () => {
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
    });

    it('Purchase between 2 users and not enough money', async () => {
        await dropDatabase();
        const user1 = await createUser();
        const user2 = await createUser();
        const product = {
            productName: uuid4(),
            price: 300,
            initialStock: 15,
            description: uuid4(),
            dues: 3,
            owner: user1.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/product/purchase/"+resultPost.data+"/"+user2.mail));
        expect(resultError.status).toEqual(404);
        expect(resultError.e).toEqual("Not enough founds. You need '" + (product.price - 100) + "' more for buying that product.");
    });

    it('Purchase between 2 users and not enough stock', async () => {
        await dropDatabase();
        const user1 = await createUser();
        const user2 = await createUser();
        const product = {
            productName: uuid4(),
            price: 300,
            initialStock: 0,
            description: uuid4(),
            dues: 3,
            owner: user1.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port + "/product/purchase/"+resultPost.data+"/"+user2.mail));
        expect(resultError.status).toEqual(404);
        expect(resultError.e).toEqual("There is no stock for that item.");
    });

    it('Change product parameter', async () => {
        await dropDatabase();
        const user1 = await createUser();
        const product = {
            productName: uuid4(),
            price: 300,
            initialStock: 5,
            description: uuid4(),
            dues: 3,
            owner: user1.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultPost2 = await axios.post("http://localhost:" + settings.port +
         "/product/"+resultPost.data+"/change/parameter/initialStock/value/"+10);
        expect(resultPost2.status).toEqual(200);
    });

    it('Change wrong product parameter', async () => {
        await dropDatabase();
        const user1 = await createUser();
        const product = {
            productName: uuid4(),
            price: 300,
            initialStock: 5,
            description: uuid4(),
            dues: 3,
            owner: user1.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port +
         "/product/"+resultPost.data+"/change/parameter/soja/value/"+10));
        expect(resultError.status).toEqual(404);
        expect(resultError.e).toEqual("Not a product format.");
    });

    it('Add comment to a product', async () => {
        await dropDatabase();
        const products = database.getProductsCollection()
        const user1 = await createUser();
        const text = "NICE TEST!";
        const product = {
            productName: uuid4(),
            price: 300,
            initialStock: 5,
            description: uuid4(),
            dues: 3,
            owner: user1.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultPost2 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment",{
            user: user1.mail,
            text: text
        });
        expect(resultPost2.status).toEqual(200);
        const productCommented = await products.findOne({productKey: resultPost.data});
        expect(productCommented.comments.length).toEqual(1);
        expect(productCommented.comments[0].text).toEqual(text);
    });


    it('Add upvote to a product', async () => {
        await dropDatabase();
        const products = database.getProductsCollection()
        const user = await createUser();
        const text = "NICE TEST!";
        const product = {
            productName: uuid4(),
            price: 300,
            initialStock: 5,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultPost2 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment",{
            user: user.mail,
            text: text
        });
        expect(resultPost2.status).toEqual(200);
        const productCommented = await products.findOne({productKey: resultPost.data});
        expect(productCommented.comments.length).toEqual(1);
        expect(productCommented.comments[0].text).toEqual(text);
        const resultPost3 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment/upvote/0",{
            user: user.mail
        });
        expect(resultPost3.status).toEqual(200);
        const productCommented2 = await products.findOne({productKey: resultPost.data});
        expect(productCommented2.comments.length).toEqual(1);
        expect(productCommented2.comments[0].points).toEqual(1);
        expect(productCommented2.comments[0].voters.indexOf(user.mail)).toBeGreaterThanOrEqual(0);
    });


    
    it('Add upvote to a product which already has it', async () => {
        await dropDatabase();
        const products = database.getProductsCollection()
        const user = await createUser();
        const text = "NICE TEST!";
        const product = {
            productName: uuid4(),
            price: 300,
            initialStock: 5,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultPost2 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment",{
            user: user.mail,
            text: text
        });
        expect(resultPost2.status).toEqual(200);
        const productCommented = await products.findOne({productKey: resultPost.data});
        expect(productCommented.comments.length).toEqual(1);
        expect(productCommented.comments[0].text).toEqual(text);
        const resultPost3 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment/upvote/0",{
            user: user.mail
        });
        expect(resultPost3.status).toEqual(200);
        const productCommented2 = await products.findOne({productKey: resultPost.data});
        expect(productCommented2.comments.length).toEqual(1);
        expect(productCommented2.comments[0].points).toEqual(1);
        expect(productCommented2.comments[0].voters.indexOf(user.mail)).toBeGreaterThanOrEqual(0);
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment/upvote/0",{
            user: user.mail
        }));
        expect(resultError.status).toEqual(404);
        expect(resultError.e).toEqual("You have already upvoted it.");
    });


    it('Add downvote to a product', async () => {
        await dropDatabase();
        const products = database.getProductsCollection()
        const user = await createUser();
        const text = "NICE TEST!";
        const product = {
            productName: uuid4(),
            price: 300,
            initialStock: 5,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultPost2 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment",{
            user: user.mail,
            text: text
        });
        expect(resultPost2.status).toEqual(200);
        const productCommented = await products.findOne({productKey: resultPost.data});
        expect(productCommented.comments.length).toEqual(1);
        expect(productCommented.comments[0].text).toEqual(text);
        const resultPost3 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment/downvote/0",{
            user: user.mail
        });
        expect(resultPost3.status).toEqual(200);
        const productCommented2 = await products.findOne({productKey: resultPost.data});
        expect(productCommented2.comments.length).toEqual(1);
        expect(productCommented2.comments[0].points).toEqual(-1);
        expect(productCommented2.comments[0].voters.indexOf(user.mail)).toBeGreaterThanOrEqual(0);
    });


    
    it('Add downvote to a product which already has it', async () => {
        await dropDatabase();
        const products = database.getProductsCollection()
        const user = await createUser();
        const text = "NICE TEST!";
        const product = {
            productName: uuid4(),
            price: 300,
            initialStock: 5,
            description: uuid4(),
            dues: 3,
            owner: user.mail,
            timestamp: Math.trunc((new Date()).getTime()/1000),
        }
        const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
        expect(resultPost.status).toEqual(200);
        const resultPost2 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment",{
            user: user.mail,
            text: text
        });
        expect(resultPost2.status).toEqual(200);
        const productCommented = await products.findOne({productKey: resultPost.data});
        expect(productCommented.comments.length).toEqual(1);
        expect(productCommented.comments[0].text).toEqual(text);
        const resultPost3 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment/downvote/0",{
            user: user.mail
        });
        expect(resultPost3.status).toEqual(200);
        const productCommented2 = await products.findOne({productKey: resultPost.data});
        expect(productCommented2.comments.length).toEqual(1);
        expect(productCommented2.comments[0].points).toEqual(-1);
        expect(productCommented2.comments[0].voters.indexOf(user.mail)).toBeGreaterThanOrEqual(0);
        const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment/downvote/0",{
            user: user.mail
        }));
        expect(resultError.status).toEqual(404);
        expect(resultError.e).toEqual("You have already upvoted it.");
    });


    // it('Add subcomment to a product comment', async () => {
    //     await dropDatabase();
    //     const products = database.getProductsCollection()
    //     const user = await createUser();
    //     const text = "NICE TEST!";
    //     const product = {
    //         productName: uuid4(),
    //         price: 300,
    //         initialStock: 5,
    //         description: uuid4(),
    //         dues: 3,
    //         owner: user.mail,
    //         timestamp: Math.trunc((new Date()).getTime()/1000),
    //     }
    //     const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
    //     expect(resultPost.status).toEqual(200);
    //     const resultPost2 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment",{
    //         user: user.mail,
    //         text: text
    //     });
    //     expect(resultPost2.status).toEqual(200);
    //     const productCommented = await products.findOne({productKey: resultPost.data});
    //     expect(productCommented.comments.length).toEqual(1);
    //     expect(productCommented.comments[0].text).toEqual(text);
    //     console.log(" ESTO ", "http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment/subcomment/0")
    //     const resultPost3 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment/subcomment/0",{
    //         user: user.mail,
    //         text: "NICE SUB COMMENT"
    //     });
    //     expect(resultPost3.status).toEqual(200);
    //     const productCommented2 = await products.findOne({productKey: resultPost.data});
    //     expect(productCommented2.comments[0].subcomments.length).toEqual(1);
    //     expect(productCommented2.comments[0].subcomments[0].text).toEqual("NICE SUB COMMENT");
    // });


    
    // it('Add upvote to a product which already has it', async () => {
    //     await dropDatabase();
    //     const products = database.getProductsCollection()
    //     const user = await createUser();
    //     const text = "NICE TEST!";
    //     const product = {
    //         productName: uuid4(),
    //         price: 300,
    //         initialStock: 5,
    //         description: uuid4(),
    //         dues: 3,
    //         owner: user.mail,
    //         timestamp: Math.trunc((new Date()).getTime()/1000),
    //     }
    //     const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
    //     expect(resultPost.status).toEqual(200);
    //     const resultPost2 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment",{
    //         user: user.mail,
    //         text: text
    //     });
    //     expect(resultPost2.status).toEqual(200);
    //     const productCommented = await products.findOne({productKey: resultPost.data});
    //     expect(productCommented.comments.length).toEqual(1);
    //     expect(productCommented.comments[0].text).toEqual(text);
    //     const resultPost3 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment/upvote/0",{
    //         user: user.mail
    //     });
    //     expect(resultPost3.status).toEqual(200);
    //     const productCommented2 = await products.findOne({productKey: resultPost.data});
    //     expect(productCommented2.comments.length).toEqual(1);
    //     expect(productCommented2.comments[0].points).toEqual(1);
    //     expect(productCommented2.comments[0].voters.indexOf(user.mail)).toBeGreaterThanOrEqual(0);
    //     const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment/upvote/0",{
    //         user: user.mail
    //     }));
    //     expect(resultError.status).toEqual(404);
    //     expect(resultError.e).toEqual("You have already upvoted it.");
    // });


    // it('Add downvote to a product', async () => {
    //     await dropDatabase();
    //     const products = database.getProductsCollection()
    //     const user = await createUser();
    //     const text = "NICE TEST!";
    //     const product = {
    //         productName: uuid4(),
    //         price: 300,
    //         initialStock: 5,
    //         description: uuid4(),
    //         dues: 3,
    //         owner: user.mail,
    //         timestamp: Math.trunc((new Date()).getTime()/1000),
    //     }
    //     const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
    //     expect(resultPost.status).toEqual(200);
    //     const resultPost2 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment",{
    //         user: user.mail,
    //         text: text
    //     });
    //     expect(resultPost2.status).toEqual(200);
    //     const productCommented = await products.findOne({productKey: resultPost.data});
    //     expect(productCommented.comments.length).toEqual(1);
    //     expect(productCommented.comments[0].text).toEqual(text);
    //     const resultPost3 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment/downvote/0",{
    //         user: user.mail
    //     });
    //     expect(resultPost3.status).toEqual(200);
    //     const productCommented2 = await products.findOne({productKey: resultPost.data});
    //     expect(productCommented2.comments.length).toEqual(1);
    //     expect(productCommented2.comments[0].points).toEqual(-1);
    //     expect(productCommented2.comments[0].voters.indexOf(user.mail)).toBeGreaterThanOrEqual(0);
    // });


    
    // it('Add downvote to a product which already has it', async () => {
    //     await dropDatabase();
    //     const products = database.getProductsCollection()
    //     const user = await createUser();
    //     const text = "NICE TEST!";
    //     const product = {
    //         productName: uuid4(),
    //         price: 300,
    //         initialStock: 5,
    //         description: uuid4(),
    //         dues: 3,
    //         owner: user.mail,
    //         timestamp: Math.trunc((new Date()).getTime()/1000),
    //     }
    //     const resultPost = await axios.post("http://localhost:" + settings.port + "/publish", product);
    //     expect(resultPost.status).toEqual(200);
    //     const resultPost2 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment",{
    //         user: user.mail,
    //         text: text
    //     });
    //     expect(resultPost2.status).toEqual(200);
    //     const productCommented = await products.findOne({productKey: resultPost.data});
    //     expect(productCommented.comments.length).toEqual(1);
    //     expect(productCommented.comments[0].text).toEqual(text);
    //     const resultPost3 = await axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment/downvote/0",{
    //         user: user.mail
    //     });
    //     expect(resultPost3.status).toEqual(200);
    //     const productCommented2 = await products.findOne({productKey: resultPost.data});
    //     expect(productCommented2.comments.length).toEqual(1);
    //     expect(productCommented2.comments[0].points).toEqual(-1);
    //     expect(productCommented2.comments[0].voters.indexOf(user.mail)).toBeGreaterThanOrEqual(0);
    //     const resultError = await common.getErrorAsyncRequest(axios.post("http://localhost:" + settings.port +"/product/"+resultPost.data+"/comment/downvote/0",{
    //         user: user.mail
    //     }));
    //     expect(resultError.status).toEqual(404);
    //     expect(resultError.e).toEqual("You have already upvoted it.");
    // });
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
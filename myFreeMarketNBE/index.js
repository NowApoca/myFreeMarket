const express = require("express");
const app = express();
const db = require("./src/database/database")
const router = require("./routes/routes")
const bodyParser = require("body-parser");
const { polling } = require("./indexer") 

/* Routes */

async function initialize(settings){
    if(settings === undefined){
        settings = {
            "port": 3011,
            "dbName": "myFreeMarketNodeBackend",
            "dbUrl":"mongodb://localhost:27017"
        }
    }
    await db.initialize("mongo",settings);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use("", router);
    polling()
    app.listen(settings.port)
}

if (require.main === module) {
    initialize()
}

module.exports = {
    initialize
}
const express = require("express");
const app = express();
const db = require("./src/database/database")
const router = require("./routes/routes")
const bodyParser = require("body-parser");

/* Routes */

async function initialize(){
    await db.initialize("mongo");
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use("", router);
    app.listen(3003)
}

initialize();
const { MongoClient } = require("mongodb");

let db = null

async function connectToDatabase () {
    if (!db) {
        const connectionString = process.env.DB_URL;
        const databaseName = process.env.DB_NAME;
        const client = await MongoClient.connect (connectionString);
        db = client.db(databaseName)

        console.log("connected")
    }

    return db;
}


module.exports = { connectToDatabase };
const { MongoClient } = require("mongodb");

let db = null;

async function connectToDatabase() {
  if (!db) {
    const connectionString = process.env.DB_URL;
    const databaseName = process.env.DB_NAME;

    const client = new MongoClient(connectionString, {
      serverSelectionTimeoutMS: 10000,
      tls: true,
      family: 4,
    });

    await client.connect();
    db = client.db(databaseName);

    console.log("Connected to MongoDB:", databaseName);
  }

  return db;
}

module.exports = { connectToDatabase };
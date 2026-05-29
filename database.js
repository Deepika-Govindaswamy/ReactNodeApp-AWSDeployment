


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


// const { Client } = require("pg");

// async function connectToDatabase() {
  
//   const con = new Client ({

//     host: "localhost",
//     user: "postgres",
//     port: 5432,
//     password:"deepdeep",
//     database:"todo-node"

//   })

//   con.connect().then( () => console.log("Connected"));
// }

module.exports = { connectToDatabase };
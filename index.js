
require('dotenv').config();
const express = require ('express')
const app = express()
const port = process.env.PORT

const cors = require('cors')
app.use(cors())

const { connectToDatabase } = require('./database');

app.get("/tasks", async (req, res) => {

    try {

        const db = await connectToDatabase();

        const tasks = await db.collection("test-node-apps").find({}).toArray();

        res.json(tasks);

    } catch (error) {

        console.error(error);

        res.status(500).json({message: "Error fetching tasks"});
    }
});

app.listen (port, () => {
    console.log({
            PORT: process.env.PORT,
            DB_NAME: process.env.DB_NAME,
            DB_URL_EXISTS: !!process.env.DB_URL
        });

    console.log (`Server started on ${port}`)
})
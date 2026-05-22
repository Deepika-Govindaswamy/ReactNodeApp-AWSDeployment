require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;

const cors = require('cors');
app.use(cors());

const { connectToDatabase } = require('./database');

// // CloudFront secret header middleware
// app.use((req, res, next) => {
//   // Bypass check for ALB health checks
//   if (req.path === '/health') return next();

//   const secret = req.headers['x-cloudfront-secret'];
//   if (!secret || secret !== process.env.CLOUDFRONT_SECRET) {
//     return res.status(403).json({ error: 'Forbidden' });
//   }
//   next();
// });

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// app.post('/tasks', async (req, res) => {

//     try {

//         const db = await connectToDatabase();

//         const newTask = req.body;

//         const result = await db
//             .collection('tasks')
//             .insertOne(newTask);

//         res.status(201).json({
//             message: 'Task added',
//             insertedId: result.insertedId
//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({
//             message: 'Error adding task'
//         });
//     }
// });

app.get('/tasks', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const tasks = await db.collection("test-node-apps").find({}).toArray();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

app.listen(port, () => {
  console.log({
    PORT: process.env.PORT,
    DB_NAME: process.env.DB_NAME,
    DB_URL_EXISTS: !!process.env.DB_URL,
    CLOUDFRONT_SECRET_EXISTS: !!process.env.CLOUDFRONT_SECRET
  });
  console.log(`Server started on ${port}`);
});
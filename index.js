require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;

// const port = 5001

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

app.get('/tasks', async (req, res) => {
  try {
    const pool = await connectToDatabase();
    if (pool) {console.log(`pool ok`);}
    const result = await pool.query('SELECT * FROM tasks'); // adjust table name as needed
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});



app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
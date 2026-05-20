
const express = require ('express')
const app = express()
const port = 5001

const cors = require('cors')
app.use(cors())

app.get("/tasks", (req, res) => {
    res.json([
        { id: 1, text: "Set up MongoDB and Express backend", done: true },
        { id: 2, text: "Build React + TypeScript frontend", done: false },
        { id: 3, text: "Connect API to the todo list UI", done: false },
        { id: 4, text: "Write unit tests for CRUD routes", done: false },
        { id: 5, text: "Finish AWS Deployment prototype with CI/CD Automation", done: false },
    ])
}) 

app.listen (port, () => {
    console.log (`Server started on ${port}`)
})
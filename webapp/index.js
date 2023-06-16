import express from 'express';
const app = express()
const port = 3000

import {addNewTask, getCurrentTask} from "./database.js";

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define a route to serve the HTML page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/action', (req, res) => {
  res.send({ cosik: currentTasks });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  addNewTask("drugi", 5, 15000, new Date("2023-12-17T03:24:00"))
  addNewTask("1", 5, 10000, new Date("2023-12-17T03:24:00"))
  console.log(getCurrentTask())
})




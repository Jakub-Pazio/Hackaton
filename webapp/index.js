import express from 'express';
const app = express()
const port = 3000

import {addNewTask, getCurrentTask} from "./database.js";

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.json()); // For handling JSON data
app.use(express.urlencoded({ extended: true })); // For handling URL-encoded form data

// Define a route to serve the HTML page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/action', (req, res) => {
  res.send({ cosik: getCurrentTask() });
});

app.post('/send', (req, res) => {
  const { text, userPriority, length, dueDate } = req.body;
  console.log(text, userPriority, length, dueDate);
  addNewTask(text, userPriority, length, dueDate);
  res.send({ result: "added" });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  addNewTask("1", 5, 10000, new Date("2023-12-17T03:24:00"))
  addNewTask("drugi", 10000, 10000, new Date("2023-12-17T03:24:00"))
  console.log(getCurrentTask())
})




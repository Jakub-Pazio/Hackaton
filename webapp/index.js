import express from 'express';
const app = express()
const port = 3000

import task from './database.js';
import currentTasks from "./database.js";

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
})




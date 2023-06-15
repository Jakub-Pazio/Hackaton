const express = require('express')
const app = express()
const port = 3000

const task = require('./database');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define a route to serve the HTML page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/action', (req, res) => {
  res.send({ cosik: task });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




import express from 'express';
const app = express()
const port = 3000

import {addNewTask, getCurrentTask, setTaskCompleted, loadRegularTasksData, getTasksCount, refreshRegularTasks, printAllTasks, getCurrentTaskObject, getAllTasks} from "./database.js";

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // Middleware to handle URL-encoded form data
app.use(express.json()); // Middleware to handle JSON data

// Define a route to serve the HTML page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/action', (req, res) => {
  res.send({ allTasks: getAllTasks() });
});

app.post('/send', (req, res) => {
  console.log(req.body.text, req.body.userPriority, req.body.length, new Date(req.body.dueDate), true);
  addNewTask(req.body.text, req.body.userPriority, req.body.length, new Date(req.body.dueDate), true);
  //console.log()
  res.json({ result: "added" });
  console.log(getTasksCount())
  printAllTasks()
  console.log(getCurrentTask())
});

app.post('/endtask', (req, res) => {
  let tid = req.body.taskId;
  let stid = req.body.subTaskId;

  console.log(tid);
  console.log(stid);


  setTaskCompleted(tid,stid);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  addNewTask("Do a laundry.", 5, 10000, new Date("2023-12-17T03:24:00"), true)
  addNewTask("Go to shop.", 3, 10000, new Date("2023-12-17T03:25:00"), true)
  console.log(getCurrentTaskObject())
  loadRegularTasksData()
  refreshRegularTasks()
})




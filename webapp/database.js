import PriorityQueue from "priorityqueue";
import yaml from "js-yaml"
import fs from "fs"

class Task {
  constructor(text,userPriority,duration,dueDate, taskId, subtaskId) {
      this.text = text, // string
      this.userPriority = userPriority, // int 0-10
      this.systemPriority = 0,
      this.duration = duration, // remaining time ms
      this.dueDate = dueDate, // date
      this.completed = false; // boolean
      this.taskId = taskId;
      this.subtaskId = subtaskId;
  }
};

class RegularTask {
  constructor(text,priority,duration,dueTime) {
    this.text = text,
    this.priority = priority,
    this.duration = duration,
    this.dueTime = dueTime;
    }


}
function getDueTime(rTask) {
    return rTask.dueTime.split(":");
}

const comparator = (a, b) => {

  var latestBeginA = a.dueDate.getTime() - a.duration;
  var latestBeginB = b.dueDate.getTime() - b.duration;

  var priorityA = a.userPriority;
  var priorityB = b.userPriority;

  if(latestBeginA < latestBeginB)
    priorityA+=10;
  else if (latestBeginA > latestBeginB)
    priorityB+=10;
  
    //...//

  return priorityA > priorityB ? 1 : -1;
};

const currentTasks = new PriorityQueue({ comparator });
var completedTasks = [];

const regularTasks = [];

function lookupTasks() {
    let t;
    for (t in currentTasks) {
        if(t.completed || Date.now() > t.dueDate) {
            currentTasks.splice(currentTasks.indexOf(t), 1);
        }
    }
    let temp = currentTasks.toArray();
    currentTasks.clear();
    temp.forEach(element => {
        currentTasks.push(element);
    });
}

// API

export function loadRegularTasksData() {
  try {
    const doc = yaml.load(fs.readFileSync('regularTasks.yml', 'utf8'));
    for(const element in doc) {
      const properties = doc[element]
      regularTasks.push(new RegularTask(element, properties.priority, properties.length, properties.dueTime))
    }
  } catch (e) {
    console.log(e);
  }
}

export function refreshRegularTasks() {
  regularTasks.forEach(rTask => {
      console.log(rTask);
    let date = new Date(Date.now());
    let dueTime = getDueTime(rTask)
    date.setHours(dueTime[0], dueTime[1], dueTime[2])
    if(Date.now() > date.getTime()) {
      date.setDate(date.getDate()+1);
    }
    addNewTask(rTask.text, rTask.priority, rTask.duration, date)
  });
}

export function getCurrentTask() {
    lookupTasks();
    return currentTasks.top();
}


export function setTaskCompleted(task) {
    task.completed = true;
}

export function printAllTasks(){
    console.log(currentTasks)
}

export function getTasksCount() {
    return currentTasks.length;
}

const blockDuration = 900000; // 15 min
let taskId = 0
export function addNewTask(text,userPriority,duration,dueDate) {
  let amountOfBlocks = Math.ceil(duration / blockDuration);
  for(let i = 0; i < amountOfBlocks; i++) {
    let currentDuration = blockDuration;
    duration -= currentDuration;

    let timeLeft = Math.min(blockDuration, duration);
    
    if(timeLeft < blockDuration)
      currentDuration+=timeLeft;
    duration -= timeLeft;

    currentTasks.push(new Task(text,userPriority,currentDuration, dueDate, taskId, i))
  }
  taskId++;
}

// END API








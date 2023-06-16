import PriorityQueue from "priorityqueue";
import yaml from "js-yaml"
import fs from "fs"

class Task {
  constructor(text,userPriority,systemPriority,duration,dueDate,isSplittable, taskId, subtaskId) {
      this.text = text, // string
      this.userPriority = userPriority, // int 0-10
      this.systemPriority = systemPriority,
      this.duration = duration, // remaining time ms
      this.dueDate = dueDate, // date
      this.isSplittable = isSplittable;
      this.completed = false; // boolean
      this.taskId = taskId;
      this.subtaskId = subtaskId;
  }
};

class RegularTask {
  constructor(text,priority,duration,dueTime,isSplittable) {
    this.text = text,
    this.priority = priority,
    this.duration = duration,
    this.dueTime = dueTime;
    this.isSplittable = isSplittable;
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

function refreshTaskQueue() {
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
      regularTasks.push(new RegularTask(element, properties.priority, properties.length, properties.dueTime,properties.isSplittable))
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
    addNewTask(rTask.text, rTask.priority, rTask.duration, date,rTask.isSplittable)
  });
}

export function getCurrentTaskObject() {
    refreshTaskQueue();
    return currentTasks.top();
}

export function getCurrentTask() {
  let curr = getCurrentTaskObject();
  return {
    text: curr.text,
    duration: curr.duration,
    dueDate: curr.dueDate,
    beginDate: new Date(curr.dueDate.getTime() - curr.duration)
  }
}

export function getAllTasks() {
  let returnArray = []

  let currTasksArray = currentTasks.toArray();
  for(let i = 0; i < currTasksArray.length; i++) {
    let t = currTasksArray[i];
    let curr = {
      text: t.text,
      duration: t.duration,
      dueDate: t.dueDate,
      beginDate: new Date(t.dueDate.getTime() - t.duration)
    }
    returnArray.push(curr);
  }

  return returnArray;
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
export function addNewTask(text,userPriority,duration,dueDate,isSplittable) {
  if(isSplittable) {
    let amountOfBlocks = Math.ceil(duration / blockDuration);
    for(let i = 0; i < amountOfBlocks; i++) {
      let currentDuration = blockDuration;
      duration -= currentDuration;

      let timeLeft = Math.min(blockDuration, duration);

      if(timeLeft < blockDuration)
        currentDuration+=timeLeft;
      duration -= timeLeft;

      let systemPriority = i;

      currentTasks.push(new Task(text,userPriority,systemPriority,currentDuration, dueDate,isSplittable, taskId, i))
    }
  } else {
    currentTasks.push(new Task(text,userPriority,0,duration,dueDate,isSplittable, taskId, 0))
  }
  taskId++;
}

// END API








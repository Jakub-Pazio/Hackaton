import PriorityQueue from "priorityqueue";
import yaml from "js-yaml"
import fs from "fs"

class Task {
  constructor(text,userPriority,systemPriority,length,completed,dueDate) {
    this.text = text,
      this.userPriority = userPriority, // 0-10
      this.systemPriority = systemPriority, // 0-10
      this.length = length, // ms
      this.completed = completed,
      this.dueDate = dueDate; // date
  }
};

const comparator = (a, b) => {

  var timeA = a.dueDate.getTime() - a.length;
  var timeB = b.dueDate.getTime() - b.length;

  var valueA = timeA + a.userPriority + a.systemPriority;
  var valueB = timeB + b.userPriority + b.systemPriority;

  if(timeA > timeB)
    valueA+=10;
  else if (timeA < timeB)
    valueB+=10;

  //...//

  var x = valueA;
  var y = valueB;

  return x > y ? 1 : -1;
};

const currentTasks = new PriorityQueue({ comparator });
var completedTasks = [];

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

class Properties {
  static sleepTime = null
  static wakeupTime = null

   static init() {
    try {
      const doc = yaml.load(fs.readFileSync('properties.yml', 'utf8'));
      this.sleepTime = doc.sleepTime.split(":");
      this.wakeupTime = doc.wakeupTime.split(":");
    } catch (e) {
      console.log(e);
    }
  }
};

export function initDatabase() {
  Properties.init()
  
  let date = new Date(Date.now())
  date.setDate(date.getDate()+1)
  date.setHours(Properties.sleepTime[0],Properties.sleepTime[1],Properties.sleepTime[2]);
  addNewTask("Go to sleep", 0, 28800000, date)
}

// REGION API

export function getCurrentTask() {
    lookupTasks();
    return currentTasks.top();
}

export function setTaskCompleted(task) {
    task.completed = true;
}

export function addNewTask(text,userPriotity,length,dueDate) {
  let t = new Task(text,userPriotity,0,length,false,dueDate)
  currentTasks.push(t)
}

// END REGION API








import PriorityQueue from "priorityqueue";
import yaml from "js-yaml"
import fs from "fs"

class Task {
  constructor(text,priority,length,dueDate) {
      this.text = text, // string
      this.priority = priority, // int 0-10
      this.length = length, // time ms
      this.dueDate = dueDate, // date
      this.completed = false; // boolean
  }
};

class RegularTask {
  constructor(text,priority,length,dueTime) {
    this.text = text,
    this.priority = priority,
    this.length = length,
    this.dueTime = dueTime;
  }

  getDueTime() {
    return this.dueTime.split(":");
  }
}

const comparator = (a, b) => {

  var timeA = a.dueDate.getTime() - a.length;
  var timeB = b.dueDate.getTime() - b.length;

  var valueA = timeA + a.priority
  var valueB = timeB + b.priority
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
  for(const rTask in regularTasks) {
    let date = new Date(Date.now());
    dueTime = rTask.getDueTime();
    date.setHours(dueTime[0], dueTime[1], dueTime[2])
    if(Date.now().getTime() > date.getTime()) {
      date.setDate(date.getDate()+1);
    }
    
    let newTask = new Task(rTask.text, rTask.priority, rTask.length, date);
    currentTasks.push(newTask);
  }
  let date = new Date(Date.now())
  date.setDate(date.getDate()+1)
  date.setHours(Properties.wakeupTime[0],Properties.wakeupTime[1],Properties.wakeupTime[2]);
  addNewTask("Sleep", 0, Properties.sleepLength, date)


}

export function getCurrentTask() {
    lookupTasks();
    return currentTasks.top();
}

export function setTaskCompleted(task) {
    task.completed = true;
}

export function getTasksCount() {
    return currentTasks.length;
}

export function addNewTask(text,priority,length,dueDate) {
  let t = new Task(text,priority,length,dueDate)
  currentTasks.push(t)
}

// END API








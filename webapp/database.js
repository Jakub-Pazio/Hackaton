import PriorityQueue from "priorityqueue";

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

// export default {getCurrentTask, setTaskCompleted, addNewTask}

// END REGION API








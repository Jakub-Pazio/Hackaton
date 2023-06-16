import PriorityQueue from "priorityqueue";

const task = {
  text: 'Unnamed task',
  userPriority: 0, // 0-10
  systemPriority: 0, // 0-10
  length: 0, // ms
  completed: false, 
  dueDate: null // date
};

const taskComparator = (a, b) => {

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

const currentTasks = new PriorityQueue({ taskComparator });
var completedTasks = [];

function lookupTasks() {
    let t;
    for (t in currentTasks) {
        if(t.completed || Date.now() > t.dueDate) {
            currentTasks.splice(currentTasks.indexOf(t), 1);
        }
    }
    temp = currentTasks.toArray();
    currentTasks.clear();
    temp.array.forEach(element => {
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
  t = task.create()
  t.text = text;
  t.userPriority = userPriotity;
  t.length = length;
  t.dueDate = dueDate;
  currentTasks.push(t);
}

// export default {getCurrentTask, setTaskCompleted, addNewTask}

// END REGION API








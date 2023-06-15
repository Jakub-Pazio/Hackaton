import PriorityQueue from "priorityqueue";

const task = {
  text: 'Unnamed task',
  userPriority: 0,
  systemPriority: 0,
  length: 0.0,
  completed: false,
  dueDate: null
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
    for (t in currentTasks) {
        if(t.completed || Date.now() > t.dueDate) {
            myArray.splice(currentTasks.indexOf(t), 1);
        }
    }
}

// REGION API

function getCurrentTask() {
    lookupTasks();
    return currentTasks.pop();
}

function setTaskCompleted(task) {
    task.completed = true;
}

// END REGION API

export default task






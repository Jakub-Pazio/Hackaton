import PriorityQueue from "priorityqueue";

const taskComparator = (a, b) => {
  var timeA = a.dueDate.getTime() - a.length;
  var timeB = b.dueDate.getTime() - b.length;

  var valueA = timeA + a.userPriority + a.systemPriority;
  var valueB = timeB + b.userPriority + b.systemPriority;

  if(timeA > timeB)
    valueA+=10;
  else if(timeA < timeB)
    valueB+=10;

  //...//

  var x = valueA;
  var y = valueB;

  return x > y ? x : y;
};

const currentTasks = new PriorityQueue({ taskComparator });
var completedTasks = [];
const states = [];

const task = {
  text: 'Unnamed task',
  userPriority: 0,
  systemPriority: 0,
  length: 0.0,
  completed: false,
  dueDate: null
};

const state = {
  current : currentTasks,
  completed : completedTasks,
}

module.exports = task




const nameInput = $("#task-name");
const dueDateInput = $("#task-due");
const descrtiptionInput = $("#task-description");
const form = $("#modal-form");

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $("<div>")
    .addClass("card task-card draggable my-3")
    .attr("data-task-id", task.id);
  const cardHeader = $("<div>").addClass("card-header h4").text(task.name);
  const cardBody = $("<div>").addClass("card-body");
  const cardDescription = $("<p>").addClass("card-text").text(task.descrtiption);
  const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
  const cardDeleteBtn = $("<button>")
    .addClass("btn btn-danger delete")
    .text("Delete")
    .attr("data-task-id", task.id);
  cardDeleteBtn.on("click", handleDeleteTask);

  if (task.dueDate && task.status !== "done") {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, "DD/MM/YYYY");

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, "day")) {
      taskCard.addClass("bg-warning text-white");
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass("bg-danger text-white");
      cardDeleteBtn.addClass("border-light");
    }
  }

  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // ? Empty existing project cards out of the lanes
  const todoList = $("#todo-cards");
  todoList.empty();

  const inProgressList = $("#in-progress-cards");
  inProgressList.empty();

  const doneList = $("#done-cards");
  doneList.empty();

  // ? Loop through projects and create task cards for each status
  for (let task of taskList) {
    switch (task.status) {
      case "to-do":
        todoList.append(createTaskCard(task));
        break;
      case "in-progress":
        inProgressList.append(createTaskCard(task));
        break;
      case "done":
        doneList.append(createTaskCard(task));
        break;
    }
  }

  // ? Use JQuery UI to make task cards draggable
  $(".draggable").draggable({
    opacity: 0.7,
    zIndex: 100,
    helper: function (e) {
      const original = $(e.target).hasClass("ui-draggable")
        ? $(e.target)
        : $(e.target).closest(".ui-draggable");
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  console.log(nameInput.val());
  console.log(dueDateInput.val());
  console.log(descrtiptionInput.val());

  event.preventDefault();

  // const projectName = projectNameInputEl.val().trim();
  // const projectType = projectTypeInputEl.val(); // don't need to trim select input
  // const projectDate = projectDateInputEl.val(); // yyyy-mm-dd format

  const newTask = {
    id: crypto.randomUUID(),
    name: nameInput.val(),
    dueDate: dueDateInput.val(),
    descrtiption: descrtiptionInput.val(),
    status: "to-do",
  };

  // ? Pull the projects from localStorage and push the new project to the array
  taskList.push(newTask);

  // ? Save the updated projects array to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // ? Print project data back to the screen
  renderTaskList(taskList);

  // ? Clear the form inputs
  nameInput.val("");
  dueDateInput.val("");
  descrtiptionInput.val("");

  $("#formModal").modal("hide");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {});

$(function () {
  $("#task-due").datepicker();
});

form.on("submit", handleAddTask);

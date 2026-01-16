import { useState } from "react";
import Task from "./Task";
import { closestCorners, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

export default function ToDoList() {
  const [tasks, setTasks] = useState([]);
  // every time user types new task, it will be added to array tasks
  const [newTask, setNewTask] = useState("");

  // id parameter is the original id that goes with each task
  // this function connects when user checks the checkbox, it updates completed property to true
  function toggleCheckbox(id) {
    setTasks(
      // ...selectedTask is spread operator, creates a copy of task object and unpacks each property
      // flips completed property to opposite boolean value
      tasks.map((selectedTask) =>
        selectedTask.id === id
          ? { ...selectedTask, completed: !selectedTask.completed }
          : selectedTask
      )
    );
  }
  // event is the action of user dragging/dropping
  // active = dragging, over = dropping, both are properties containing selected task id as values
  function handleDragEnd(event) {
    const { active, over } = event;
    // if dragged id is not the same as dropped id, update tasks array
    // find index of that item and make it equal to the dragged or dropped id
    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        // arrayMove is a dnd function with three arguments
        // items is copy of tasks array, oldIndex replaces newIndex
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  function handleInputChange(e) {
    setNewTask(e.target.value);
  }
  // e.key answers the question to which key was pressed?
  function handleEnterKey(e) {
    if (e.key === "Enter") {
      addTask();
    }
  }
  function addTask() {
    // trim deletes any extra space before and after anything typed
    if (newTask.trim() !== "") {
      // dnd-kit must have id for each item, also contains setter variable newTask within
      const taskWithId = {
        id: Date.now(),
        text: newTask,
        completed: false,
      };
      // spread operator makes a copy of tasks array, then unpacks each item in array
      // setter function then adds value of taskWithId to existing array of tasks
      setTasks((currentTasks) => [...currentTasks, taskWithId]);
      // input form with value of newTask is reset to empty string
      setNewTask("");
    }
  }
  function deleteTask(id) {
    // filter creates a new array
    // if task with an id is not equal to user selected id, keep the task in the array
    const updatedTasks = tasks.filter(
      (taskWithIdPara) => taskWithIdPara.id !== id
    );
    setTasks(updatedTasks);
  }
  // ** if drag/drop doesnt work, manually move tasks up and down ** \\
  // function moveTaskUp(index) {
  //   const updatedTasks = [...tasks];
  //   // prevent moving task up if index is 0, already at the top
  //   if (index > 0) {
  //     // destructuring [a, b] = [b, a]
  //     [updatedTasks[index], updatedTasks[index - 1]] = [
  //       updatedTasks[index - 1],
  //       updatedTasks[index],
  //     ];
  //     setTasks(updatedTasks);
  //   }
  // }
  // function moveTaskDown(index) {
  //   const updatedTasks = [...tasks];
  //   //   prevent moving task down if already at bottom.
  //   // length starts counting at 1, so - 1 to be correct index of task
  //   if (index < tasks.length - 1) {
  //     [updatedTasks[index], updatedTasks[index + 1]] = [
  //       updatedTasks[index + 1],
  //       updatedTasks[index],
  //     ];
  //     setTasks(updatedTasks);
  //   }

  return (
    <div className="to-do-list">
      <h1>🍃 To Do List 🍂</h1>
      <div className="input">
        <input
          type="text"
          value={newTask}
          onKeyDown={handleEnterKey}
          onChange={handleInputChange}
          placeholder="Enter a task"
        />
        <button className="add-button" onClick={addTask}>
          Add Task
        </button>
      </div>
      {/* detects when items are close enough to swap */}
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        {/* sortablecontext defines sortable area and only needs id to track each item */}
        {/* iterate over each task object in tasks array and callback the property value of id */}
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul>
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                toggleCheckbox={toggleCheckbox}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

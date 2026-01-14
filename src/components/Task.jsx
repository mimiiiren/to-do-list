import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Task({ task, deleteTask, toggleCheckbox }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div>
      <ul>
        <li
          ref={setNodeRef}
          style={style}
          className="task-component"
          key={task.id}
        >
          <div className="right-drag-handle">
            <span
              {...attributes}
              {...listeners}
              style={{ cursor: "grab", fontSize: "20px" }}
            >
              ⋮⋮
            </span>
            <input
              type="checkbox"
              className="checkbox"
              checked={task.completed}
              onChange={() => {
                console.log("Checkbox clicked for task:", task.id);
                toggleCheckbox(task.id);
              }}
            />
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.text}
            </span>
            {/* anonymous function to not call it immediately, must add index prop  */}
            <button
              className="delete-button"
              onClick={() => deleteTask(task.id)}
              onPointerDown={(e) => e.stopPropagation()}
            >
              Delete
            </button>
          </div>
          {/* drag handle */}
          <span
            {...attributes}
            {...listeners}
            style={{
              cursor: "grab",
              fontSize: "20px",
              margin: "0 5rem",
            }}
          >
            ⋮⋮
          </span>
          {/* <button
              className="move-up-button"
              onClick={() => moveTaskUp(index)}
            >
              Up
            </button>
            <button
              className="move-down-button"
              onClick={() => moveTaskDown(index)}
            >
              Down
            </button> */}
        </li>
      </ul>
    </div>
  );
}

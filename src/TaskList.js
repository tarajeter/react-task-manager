
import {useState} from 'react';


function TaskList({tasks, deleteTask, editTask, toggleComplete}) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState("");
    const today = new Date().toISOString().split("T")[0];
    

    return (
  <>
    {tasks.length === 0 && (
      <div className="empty-state">
      <p className="empty-state">No tasks found. Add a new task above.</p>
      <small>Add a task to get started.</small>  
      </div>
    )}

    <ul>
      {tasks.map((t, index) => {
        const isOverdue = t.dueDate && t.dueDate < today && !t.completed;
        const isDueToday = t.dueDate === today && !t.completed;
        
        return (
        <li key={index} className={`task-item ${isOverdue ? "overdue" : ""}
        ${isDueToday ? "due-today" : ""}
        `}
        >

          {editingIndex === index ? (

            <>
            <div className="edit-mode">
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}

                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setEditingIndex(null);
                  }
                }}
              />
              
              <div className="edit-buttons">
              <button onClick={() => toggleComplete(index)}>
                {t.completed ? "☑️" : "⬜"}
              </button>

              <button
                onClick={() => {
                  if (!editText.trim()) return;

                  editTask(index, editText);

                  setEditingIndex(null);
                }}
              >
                💾
              </button>

             </div>
            </div>
            </>
          ) : (

            <>
            <div className="task-meta">
              <span className="due-date">
                {t.dueDate || "No Due Date"}
              </span>

              <span className="created-at">
                Created:{" "}
                {new Date(t.createdAt).toLocaleDateString()}
              </span>
              
              {t.completed && t.completedAt && (
                <span className="completed-at">
                    Complete:{t.completed}
                </span>
              )}
              
              <span className="category-tag">
                {t.category}
              </span>

              <span className={`priority ${t.priority}`}>
                {t.priority.toUpperCase()}
              </span>
            </div>

              <span
                className={`task-text ${
                  t.dueDate &&
                  t.dueDate < today &&
                  !t.completed
                    ? "overdue"
                    : ""
                }`}
                style={{
                  textDecoration: t.completed
                    ? "line-through"
                    : "none",

                  opacity: t.completed ? 0.5 : 1,
                }}
              >
                {t.text}
              </span>

              <div className="task-buttons">

                <button onClick={() => deleteTask(index)}>
                  ❌
                </button>

                <button
                  onClick={() => {
                    setEditingIndex(index);
                    setEditText(t.text);
                  }}
                >
                  ✏️
                </button>

              </div>
            </>

      )}

        </li>

      );
      })}

    </ul>
  </>
);
}

export default TaskList;

import {useState} from 'react';

function TaskInput({addTask}) {

    const [task, setTask] = useState("");

    const [priority, setPriority] = useState("medium");

    const [category, setCategory] = useState("Personal");

    const [dueDate, setDueDate] = useState(""); 

    const handleAdd = () => {
        if (task.trim() === "") return;
        addTask(task, priority, category, dueDate);
        setTask("");
    };
    
    return(
        <div className="task-input">
            <input value={task} onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Enter a task"
            />

            <input type="date" value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            />

            <select
              value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>

            </select>

            <select
              value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Health">Health</option>
                <option value="Coding">Coding</option>

            </select>

            <button onClick={handleAdd}>➕</button>
        </div>
    );
}

export default TaskInput;
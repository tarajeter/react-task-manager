import {useState, useEffect} from 'react';
import TaskInput from './TaskInput.js';
import TaskList from './TaskList.js';
import './App.css';


function App() {

  const [filter, setFilter] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");

  const [sortType, setSortType] = useState("default");

  const [categoryFilter, setCategoryFilter] = useState("All");

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");

    return savedMode === "true";
  });
 
  const[tasks, setTasks] = useState(() => {

    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const addTask = (task, priority, category, dueDate) => {
    if (!task.trim()) return;
    setTasks((prevTasks) => [...prevTasks, {text: task, completed: false, 
    priority: priority, category: category, dueDate, createdAt: Date.now()}]);
  };

  const deleteTask = (indexToDelete) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");

    if (!confirmed) return;

    setTasks(tasks.filter((_, index) => index !== indexToDelete));
  };  

  const editTask = (indexToEdit, newText) => {
    const updatedTasks = tasks.map((task, index) =>
      index === indexToEdit ? {...task, text: newText} : task);

    setTasks(updatedTasks);
  };

  const toggleComplete= (indexToToggle) => {
    const updatedTasks = tasks.map((task, index) => 
      index === indexToToggle ? {...task, completed: !task.completed,
        completedAt: !task.completed ? new Date().toLocaleString() : null} 
        : task);

    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    return true;
  })

  .filter((task) =>
  task.text.toLowerCase().includes(searchTerm.toLowerCase()
   )
  )

  .filter((task) => {
    if (categoryFilter === "All") {
      return true;
    }
    return task.category === categoryFilter;
  });
  
  const sortedTasks = [...filteredTasks];

     if (sortType === "alphabetical") {
      sortedTasks.sort((a, b) =>
      a.text.localeCompare(b.text)
    );
  }

     if (sortType === "completed") {
      sortedTasks.sort(
      (a, b) => b.completed - a.completed
    );
  }

    if (sortType === "priority") {
    const priorityOrder = {
      high: 3,
      medium: 2,
      low: 1,
    };

     sortedTasks.sort(
       (a, b) =>
         priorityOrder[b.priority] -
         priorityOrder[a.priority]
    );
  }

    if (sortType === "newest") {
      sortedTasks.sort((a, b) => b.createdAt - a.createdAt);
  }

    if (sortType === "oldest") {
      sortedTasks.sort((a, b) => a.createdAt - b.createdAt);
  }
  
  const categoryCounts = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {})

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  }

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;

  const completionPercentage = totalTasks === 0 ? 0 : 
  Math.round((completedTasks / totalTasks) * 100);
  


  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>

      <button onClick={toggleDarkMode}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1>Task Manager</h1>

      <TaskInput addTask={addTask} />

      <div className="task-stats">
        <p>Total: {totalTasks}</p>
        <p>Completed: {completedTasks}</p>
        <p>Remaining: {remainingTasks}</p>

      </div>

      <input type="text" placeholder="Search tasks..." value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <p>Progress: {completionPercentage}%</p>

      <div className="progress-bar">
        <div className="progress-fill"
        style={{width: `${completionPercentage}%`,}}>

        </div>
      </div>
      
      <div className="category-counts">
        {Object.entries(categoryCounts).map(([category, count]) => (
          <span key={category}>
            {category}: {count}
          </span>
        ))}
      </div>
      
      <div className="filter-buttons">

        <button onClick={clearCompleted}>Clear Completed</button>

        <button onClick={() => setFilter("all")}>All</button>

        <button onClick={() => setFilter("active")}>Active</button>

        <button onClick={() => setFilter("completed")}>Completed</button>

      </div>

      <select value={sortType}
      onChange={(e) => setSortType(e.target.value)}>

        <option value="default">Default</option>

        <option value="alphabetical">Alphabetical</option>

        <option value="completed">Completed First</option>

        <option value="priority">Priority</option>

        <option value="newest">Newest First</option>

        <option value="oldest">Oldest First</option>

      </select>

      <select value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}>

        <option value="All">All Categories</option>

        <option value="Personal">Personal</option>

        <option value="Work">Work</option>

        <option value="Health">Health</option>

        <option value="Coding">Coding</option>

      </select>

      <TaskList tasks={sortedTasks} deleteTask={deleteTask} editTask={editTask}
       toggleComplete={toggleComplete} />


    </div>
  );
}

export default App;

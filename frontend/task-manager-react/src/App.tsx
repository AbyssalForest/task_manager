// frontend/src/App.tsx

import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import "./App.css";
import TaskCard from "./components/TaskCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface Task {
  taskId: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError("Nepodařilo se načíst úkoly.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const response = await axios.post(API_URL, {
        title: newTaskTitle,
        description: "",
      });
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
    } catch (err) {
      setError("Nepodařilo se přidat úkol.");
      console.error(err);
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.taskId === updatedTask.taskId ? updatedTask : task
      )
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TaskMaster Cloud</h1>
        <form onSubmit={handleAddTask} className="task-form">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Napište název nového úkolu..."
          />
          <button type="submit">Přidat úkol</button>
        </form>
      </header>

      <main>
        {loading && <p>Načítám úkoly...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="tasks-grid">
          {!loading &&
            !error &&
            tasks.map((task) => (
              <TaskCard
                key={task.taskId}
                task={task}
                onUpdate={handleUpdateTask}
              />
            ))}
        </div>
      </main>
    </div>
  );
}

export default App;

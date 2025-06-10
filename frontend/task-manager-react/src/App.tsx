import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:8000/api/tasks";

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
      const response = await axios.post(API_URL, { title: newTaskTitle });
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
    } catch (err) {
      setError("Nepodařilo se přidat úkol.");
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TaskMaster (Lokální verze)</h1>

        <form onSubmit={handleAddTask} className="task-form">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Napište název nového úkolu..."
          />
          <button type="submit">Přidat úkol</button>
        </form>

        <div className="task-list">
          {loading && <p>Načítám úkoly...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && (
            <ul>
              {tasks.map((task) => (
                <li
                  key={task.taskId}
                  style={{
                    textDecoration: task.isCompleted ? "line-through" : "none",
                  }}
                >
                  <strong>{task.title}</strong>
                  <button
                    onClick={async () => {
                      try {
                        await axios.delete(`${API_URL}/${task.taskId}`);
                        setTasks(tasks.filter((t) => t.taskId !== task.taskId));
                      } catch (err) {
                        setError("Nepodařilo se odstranit úkol.");
                        console.error(err);
                      }
                    }}
                  >
                    Odstranit
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const updatedTask = {
                          ...task,
                          isCompleted: !task.isCompleted,
                        };
                        await axios.put(`${API_URL}/${task.taskId}`, {
                          updatedTask: updatedTask,
                        });
                        setTasks(
                          tasks.map((t) =>
                            t.taskId === task.taskId ? updatedTask : t
                          )
                        );
                      } catch (err) {
                        setError("Nepodařilo se aktualizovat stav úkolu.");
                        console.error(err);
                      }
                    }}
                  >
                    {task.isCompleted ? "Dokončeno" : "Nedokončeno"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;

import React, { useState } from "react";
import "./TaskCard.css";
import axios from "axios";

interface Task {
  taskId: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/tasks";

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const cardClasses = `task-card ${task.isCompleted ? "completed" : ""}`;
  const statusClasses = `task-card__status ${
    task.isCompleted ? "completed" : "pending"
  }`;

  const handleSave = async () => {
    const updatedTask = {
      ...task,
      description: editedDescription,
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/${task.taskId}`, {
        updatedTask: updatedTask,
      });
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Chyba při aktualizaci úkolu:", error);
    }
  };

  const handleStatusChange = async () => {
    const updatedTask = {
      ...task,
      isCompleted: !task.isCompleted,
    };
    try {
      const response = await axios.put(`${API_BASE_URL}/${task.taskId}`, {
        updatedTask: updatedTask,
      });
      onUpdate(response.data);
    } catch (error) {
      console.error("Chyba zmeně stavu úkolu:", error);
    }
  };

  return (
    <div className={cardClasses}>
      <header className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <button className={statusClasses} onClick={handleStatusChange}>
          {task.isCompleted ? "Hotovo" : "Nedokončeno"}
        </button>
      </header>

      <div className="task-card__description">
        {isEditing ? (
          <div className="task-card__edit-mode">
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="task-card__textarea"
            />
            <div className="task-card__edit-actions">
              <button onClick={handleSave} className="button-save">
                Uložit
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="button-cancel"
              >
                Zrušit
              </button>
            </div>
          </div>
        ) : (
          <>
            <p>{editedDescription || <em>Bez popisu</em>}</p>
            <button onClick={() => setIsEditing(true)} className="button-edit">
              Upravit popis
            </button>
          </>
        )}
      </div>

      <footer className="task-card__footer">ID: {task.taskId}</footer>
    </div>
  );
};

export default TaskCard;

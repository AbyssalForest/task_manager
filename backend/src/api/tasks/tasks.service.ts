import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Task } from "../../types/task.types";

const dbPath = path.join(__dirname, "..", "..", "..", "db.json");

const readDb = async (): Promise<{ tasks: Task[] }> => {
  const data = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(data);
};

const writeDb = async (db: { tasks: Task[] }) => {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
};

const getAll = async (): Promise<Task[]> => {
  const db = await readDb();
  return db.tasks;
};

const create = async (title: string, description: string): Promise<Task> => {
  if (!title) {
    throw new Error("Title is required");
  }

  const db = await readDb();
  const newTask: Task = {
    taskId: uuidv4(),
    title,
    description: description || "",
    isCompleted: false,
  };

  db.tasks.push(newTask);
  await writeDb(db);

  return newTask;
};

const deleteTask = async (taskId: string): Promise<void> => {
  if (!taskId) {
    throw new Error("Id is required");
  }
  const db = await readDb();
  db.tasks = db.tasks.filter((task: Task) => task.taskId !== taskId);
  await writeDb(db);
};

const editTask = async (updatedTask: Task): Promise<Task> => {
  if (!updatedTask) {
    throw new Error("UpdatedTask is required");
  }
  const db = await readDb();
  const taskIndex = db.tasks.findIndex(
    (task: Task) => task.taskId === updatedTask.taskId
  );
  if (taskIndex !== -1) {
    db.tasks[taskIndex] = updatedTask;
  }
  await writeDb(db);
  return db.tasks[taskIndex];
};

export const taskService = {
  getAll,
  create,
  deleteTask,
  editTask,
};

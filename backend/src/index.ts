import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

interface Task {
  taskId: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "..", "db.json");

// --- API Routes ---

app.get("/api/tasks", async (req: Request, res: Response) => {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);
    res.json(db.tasks);
  } catch (error) {
    res.json({ message: "Chyba při čtení databáze.", error });
  }
});

app.post("/api/tasks", async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      res.json({ message: "Název (title) je povinný." });
      return;
    }

    const newTask: Task = {
      taskId: uuidv4(),
      title,
      description: description || "",
      isCompleted: false,
    };

    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);
    db.tasks.push(newTask);

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    res.json(newTask);
  } catch (error) {
    res.json({ message: "Chyba při ukládání úkolu.", error });
  }
});

app.delete("/api/tasks/:taskId", async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);
    db.tasks = db.tasks.filter((task: Task) => task.taskId !== taskId);

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    res.json({ message: "Úkol úspěšně smazán." });
  } catch (error) {
    res.json({ message: "Chyba při mazání úkolu.", error });
  }
});

app.put("/api/tasks/:taskId", async (req: Request, res: Response) => {
  try {
    const { updatedTask } = req.body;
    console.log(updatedTask);

    if (
      !updatedTask ||
      !updatedTask.taskId ||
      !updatedTask.title ||
      typeof updatedTask.isCompleted !== "boolean"
    ) {
      res.json({
        message: "Neplatný objekt updatedTask. Zkontrolujte požadovaná pole.",
      });
      return;
    }

    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);

    const taskIndex = db.tasks.findIndex(
      (task: Task) => task.taskId === updatedTask.taskId
    );
    if (taskIndex !== -1) {
      console.log("update index: ", taskIndex);
      db.tasks[taskIndex] = updatedTask;
    }

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    res.json({ message: `Úkol s id: ${updatedTask?.taskId} aktualizován.` });
  } catch (error) {
    res.json({ message: "Chyba při ukládání úkolu.", error });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server běží na http://localhost:${PORT}`);
});

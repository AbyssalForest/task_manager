import { Request, Response } from "express";
import { taskService } from "./tasks.service";

const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getAll();
    res.json(tasks);
  } catch (error) {
    res.json({ message: "Error fetching tasks" });
  }
};

const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const newTask = await taskService.create(title, description);
    res.json(newTask);
  } catch (error: any) {
    if (error.message.includes("required")) {
      res.json({ message: error.message });
      return;
    }
    res.json({ message: "Error creating task" });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    await taskService.deleteTask(taskId);

    res.status(200).json({ message: "Úkol úspěšně smazán." });
  } catch (error) {
    res.status(500).json({ message: "Chyba při mazání úkolu.", error });
  }
};

const editTask = async (req: Request, res: Response) => {
  try {
    const { updatedTask } = req.body;

    if (
      !updatedTask ||
      !updatedTask.taskId ||
      !updatedTask.title ||
      typeof updatedTask.isCompleted !== "boolean"
    ) {
      res.status(400).json({
        message: "Neplatný objekt updatedTask. Zkontrolujte požadovaná pole.",
      });
      return;
    }

    const editedTask = await taskService.editTask(updatedTask);

    res.status(200).json(editedTask);
  } catch (error) {
    res.json({ message: "Chyba při ukládání úkolu.", error });
  }
};

export const taskController = {
  getTasks,
  createTask,
  deleteTask,
  editTask,
};

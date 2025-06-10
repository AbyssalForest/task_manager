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

    res.json({ message: "Úkol úspěšně smazán." });
  } catch (error) {
    res.json({ message: "Chyba při mazání úkolu.", error });
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
      res.json({
        message: "Neplatný objekt updatedTask. Zkontrolujte požadovaná pole.",
      });
      return;
    }

    await taskService.editTask(updatedTask);

    res.json({ message: `Úkol s id: ${updatedTask?.taskId} aktualizován.` });
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

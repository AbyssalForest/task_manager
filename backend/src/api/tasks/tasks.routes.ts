import { Router } from "express";
import { taskController } from "./tasks.controller";

const router = Router();

router.get("/", taskController.getTasks);
router.post("/", taskController.createTask);
router.delete("/:taskId", taskController.deleteTask);
router.put("/:taskId", taskController.editTask);

export default router;

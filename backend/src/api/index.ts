// src/api/index.ts
import { Router } from "express";
import tasksRouter from "./tasks/tasks.routes";

const router = Router();

router.use("/tasks", tasksRouter);

export default router;

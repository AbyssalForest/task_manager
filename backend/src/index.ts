import express from "express";
import cors from "cors";
import apiRouter from "./api";

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

// --- API Routes ---

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Backend server běží na http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import apiRouter from "./api";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

// Exportujeme bez spuštění, kvůli automatickému testování
export default app;

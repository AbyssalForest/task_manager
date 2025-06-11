import app from "./app";

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Backend server běží na http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth",authRoutes);

app.get("/", (req, res) => {
  res.send("backend is running!");
});

export default app;

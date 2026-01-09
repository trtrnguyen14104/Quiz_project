import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import { apiLimiter } from "./middlewares/rateLimiter.js";
dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
  }
));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/", apiLimiter);

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("backend is running!");
});

export default app;

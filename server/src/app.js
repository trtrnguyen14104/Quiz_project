import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
// import passport from "passport";
import dotenv from "dotenv";
// import session from "express-session";
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

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   })
// );

// Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("backend is running!");
});

export default app;

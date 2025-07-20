import express from "express";
import cookieParser from "cookie-parser";
import connectToDatabase from "./database/mongodb.js";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import jobOrderRouter from "./routes/job-order.routes.js";
import ratelimiter from "./config/rateLimiter.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Configure CORS to allow credentials and cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow client origin
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// app.use(ratelimiter);

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/jobOrder", jobOrderRouter);

app.use(errorMiddleware);

//middleware

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  await connectToDatabase();
});

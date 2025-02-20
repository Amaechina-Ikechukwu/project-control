import express, { type Request, type Response } from "express";
import admin from "firebase-admin";
import {
  securityHeaders,
  limiter,
  logger,
  basicMiddleware,
} from "./middleware/security";
import projectRouter from "./routes/projects";
import cors from "cors";
const serviceAccount = "./xx.json";
const allowedOrigins = ["http://localhost:3000", process.env.ALLOWED];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

// Express App
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json()); // JSON Parser
app.use(securityHeaders);
app.use(limiter);
app.use(logger);
app.use(basicMiddleware);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Example Route
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    express.json()(req, res, next);
  } else {
    next();
  }
});
app.use("/projects", projectRouter);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

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
import projectRouterV2 from "./routes/v2/projects";
const {
  setupKinde,
  protectRoute,
  getUser,
  GrantType,
} = require("@kinde-oss/kinde-node-express");

const serviceAccount = "./xx.json";
const allowedOrigins = ["http://localhost:3000", process.env.ALLOWED];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

// Express App
const app = express();
const port = process.env.PORT || 4000;
const config = {
  clientId: process.env.KINDE_CLIENT_ID,
  issuerBaseUrl: process.env.KINDE_ISSUER_URL,
  siteUrl: process.env.KINDE_SITE_URL || "http://localhost:4000",
  secret: process.env.KINDE_CLIENT_SECRET,
  redirectUrl: process.env.KINDE_SITE_URL || "http://localhost:4000",
  scope: "openid profile email",
  grantType: GrantType.AUTHORIZATION_CODE,
  unAuthorisedUrl: "http://localhost:4000/unauthorised",
  postLogoutRedirectUrl: process.env.KINDE_SITE_URL || "http://localhost:4000",
};

setupKinde(config, app);
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
app.use("/projects/v2", protectRoute, getUser, projectRouterV2);


// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import type { Request, Response, NextFunction } from "express";
import { getUser, protectRoute } from "@kinde-oss/kinde-node-express";
import { getProjectByApiKey } from "../functions/v2/apikeys";

// Security Headers
export const securityHeaders = helmet();

// Rate Limiting (100 requests per 15 minutes per IP)
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests, please try again later.",
  headers: true,
});

// Request Logging
export const logger = morgan("combined");

// Example Custom Middleware
export const basicMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};

export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as string; // Ensure user exists
    if (!user) return res.status(401).json({ error: "User not authenticated" });

    const apiKey = req.headers["x-api-key"] as string;
    if (!apiKey) return res.status(401).json({ error: "API Key required" });

    const project = await getProjectByApiKey(user, apiKey);
    if (!project) return res.status(403).json({ error: "Invalid API Key" });

    // Attach project name to req for further use
    req.body.project = project;
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
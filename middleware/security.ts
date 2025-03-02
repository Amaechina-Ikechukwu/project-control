import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import type { Request, Response, NextFunction } from "express";
import { getUser, protectRoute } from "@kinde-oss/kinde-node-express";
const { jwtVerify } = require("@kinde-oss/kinde-node-express");

export const verifier = jwtVerify(process.env.KINDE_SUB_DOMAIN);
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

export interface CustomRequest extends Request {
  user?: string; // If you have user authentication
  ip?: string; // Add the missing 'ip' property
}

// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const tagAccessCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many access code attempts, please try again later',
  skipSuccessfulRequests: true // only count failed attempts
});
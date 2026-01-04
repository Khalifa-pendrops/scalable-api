// applied only on the login and refresh auth endpoints
// must not be applied globally
// must not be applied on the register endpoint

import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // max attempt per IP
  legacyHeaders: false,
  message: {
    success: false,
    message: "Aww too many attempts. Please try again later.",
  },
});

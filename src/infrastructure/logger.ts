// explicitly redact headers and secrets to prevent accidental leaks

import pino from "pino";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  redact: [
    "req.headers.authorization",
    "req.body.password",
    "req.body.refreshToken",
  ],
});

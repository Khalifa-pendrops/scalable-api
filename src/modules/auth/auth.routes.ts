import { loginSchema, registerSchema } from "./auth.schema";
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { authRateLimiter } from "../../middleware/rateLimit.middleware";
import { mongoStatus } from "../../infrastructure/db/status";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db: {
      mongo: mongoStatus(),
    },
  });
});

router.post("/register", validate(registerSchema), AuthController.register);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  AuthController.login
);

router.post("/refresh", authRateLimiter, AuthController.refresh);

router.post("/logout", AuthController.logout);

router.post("/logout-all", requireAuth, AuthController.logoutAll);

export default router;

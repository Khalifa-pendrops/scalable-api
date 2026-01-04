import { loginSchema, registerSchema } from "./auth.schema";
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();


router.post("/register", validate(registerSchema), AuthController.register);


router.post("/login", validate(loginSchema), AuthController.login);

router.post("/refresh", AuthController.refresh);

router.post("/logout", AuthController.logout);

router.post("/logout-all", requireAuth, AuthController.logoutAll);

export default router;

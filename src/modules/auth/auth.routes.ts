import { loginSchema, registerSchema } from "./auth.schema";
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";

const router = Router();

router.post("/reguster", validate(registerSchema), AuthController.register);

router.post("/login", validate(loginSchema), AuthController.login);

export default router;

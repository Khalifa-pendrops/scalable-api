// ensures password is never returned

import { AuthService } from "./auth.service";
import { Request, Response, NextFunction } from "express";

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, username, password } = req.body;

      // ❌ you were passing positional args
      const user = await authService.register({
        email,
        username,
        password,
      });

      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, password } = req.body;

      const tokens = await authService.login(identifier, password, {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      // ❌ res.status(...) instead of res.json(...)
      res.json({
        success: true,
        data: tokens,
      });
    } catch (e) {
      next(e);
    }
  }
}

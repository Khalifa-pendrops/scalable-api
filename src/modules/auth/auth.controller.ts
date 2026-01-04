// ensures password is never returned

import { AuthService } from "./auth.service";
import { Request, Response, NextFunction } from "express";

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, username, password } = req.body;

      const user = await authService.register({
        email,
        username,
        password,
      });

      return res.status(201).json({
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

      return res.status(201).json({
        success: true,
        data: tokens,
      });
    } catch (e) {
      next(e);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      const tokens = await authService.refresh(refreshToken, {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(201).json({ success: true, data: tokens });
    } catch (e: any) {
      next(e);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      await authService.logout(refreshToken);

      return res.status(201).json({ success: true });
    } catch (e: any) {
      next(e);
    }
  }

  static async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.sub;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Sorry! unauthorized",
        });
      }

      await authService.logoutAll(userId);

      return res.json({
        success: true,
        message: "Logged out on all devices!",
      });
    } catch (e) {
      return next(e);
    }
  }
}

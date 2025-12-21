// ensures password is never returned 

import { AuthService } from "./auth.service";
import { Request, Response, NextFunction } from "express";

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, username, password } = req.body;

      const user = await authService.register(email, username, password);

      res.status(201).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (e: any) {
      next(e);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message:
          "Sorry unauthorized cause you probably have no token or whatever",
      });
    }

    const token = header.split(" ")[1];

    const payload = jwt.verify(token, env.JWT_SECRET) as {
      sub: string;
      roles?: string[];
    };

    // attach user context
    // (req as any).user = payload;
    req.user = {
      id: payload.sub,
      roles: payload.roles ?? [],
    };

    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
}

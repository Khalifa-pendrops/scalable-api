import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  sub: string;
  roles: string[];
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "🚨 Unauthorized attempt!" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = {
      id: payload.sub,
      roles: payload.roles,
    };

    next();
  } catch (e: any) {
    return res
      .status(401)
      .json({ message: " Token might be invalid or expred. Sorry." });
  }
  next();
}

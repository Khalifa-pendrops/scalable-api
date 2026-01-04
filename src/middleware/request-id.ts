import { v4 as uuid } from "uuid";
import { Request, Response, NextFunction } from "express";

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = uuid();

  req.id = id;
  res.setHeader("X-Request-ID", id);

  next();
}

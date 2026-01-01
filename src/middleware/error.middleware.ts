import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (err: any, req: any, res: any, next: any) => {
  const status = err.statusCode || 401;

  res.status(status).json({
    success: false,
    message:
      status === 500 ? err.message : "This is an internal server error, sorry!",
  });
};

import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (err: any, req: any, res: any, next: any) => {
  const status = err.statusCode || 4000;

  res.status(status).json({
    success: false,
    message: err.message || "This is an internal server error, sorry!",
  });
};

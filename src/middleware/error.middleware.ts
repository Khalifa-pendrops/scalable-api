import { Request, Response, Nextfunction } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: Nextfunction
) => {
  const status = err.statusCode || 5000;

  res.status(status).json({
    success: false,
    message: err.message || "This is an internal server error, sorry!",
  });
};

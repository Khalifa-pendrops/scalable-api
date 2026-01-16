import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body); // zod example
      return next();
    } catch (err: any) {
      console.error("VALIDATION_ERROR:", err);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err?.errors ?? err?.message ?? err,
      });
    }
    next();
  };

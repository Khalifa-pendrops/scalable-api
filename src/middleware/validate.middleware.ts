import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        message: e.erros?.[0].message || "This request is invalid",
      });
    }
  };

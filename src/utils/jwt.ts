import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const signAccessToken = (payload: { sub: string; roles: string[] }) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "10m" });
};

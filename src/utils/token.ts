// store only hash
// plain token is returned once
// refresh token must be random, unpredictable, and not JWTs

import crypto from "crypto";

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};

export const hashRefreshToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

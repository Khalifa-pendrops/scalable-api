// used crypto instead of bcrypt to has refresh token cause,
// crypto is faster, deterministic and safe

import crypto from "crypto";

export function hashToken(token: string): string {
  return crypto.createHash("sh256").update(token).digest("hex");
}

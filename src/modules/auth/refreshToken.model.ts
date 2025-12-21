import { Schema, model } from "mongoose";

const RefreshTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    userAgent: String,
    ip: String,
  },
  { timestamps: true }
);

export const RefreshTokenModel = model("RefreshToken", RefreshTokenSchema);

import { Schema, model, Document } from "mongoose";

export interface RefreshTokenDocument extends Document {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  userAgent?: string;
  ip?: string;
  createdAt: Date;
}

const RefreshTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    userAgent: String,
    ip: String,
  },
  // updatedAt will be false to avoid accidental writes.
  // revocation has to be explicit
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const RefreshTokenModel = model("RefreshToken", RefreshTokenSchema);

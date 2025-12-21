// DB model

import { Schema, model } from "mongoose";
import { UserDocument } from "./auth.types";

export const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], required: true },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", UserSchema);

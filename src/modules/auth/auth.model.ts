//DB model

import { Schema, model, InferSchemaType, Types } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, index: true },
    password: { type: String, unique: true, required: true },
    username: { type: String, unique: true, index: true },
    roles: { type: [String], default: ["user"] },
  },
  { timestamps: true }
);

type UserSchemaType = InferSchemaType<typeof UserSchema>;

export type UserDocument = UserSchemaType & {
  _id: Types.ObjectId;
};

export const UserModel = model<UserDocument>("User, UserSchema");

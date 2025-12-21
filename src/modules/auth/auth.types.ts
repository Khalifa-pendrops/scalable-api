import { Types } from "mongoose";

export interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
  roles: string[];
  createdAt: Date;
}

export type UserDocument = {
  _id: Types.ObjectId;
  email: string;
  username: string;
  password: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
};

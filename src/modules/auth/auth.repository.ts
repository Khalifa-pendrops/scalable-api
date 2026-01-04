// we will prevent DB logic leaking everywhere
// easier testing and migrations
// keeps service layer clean and concise
// this is purely DB abstraction

import { UserModel } from "./auth.model";
import { UserDocument } from "./auth.types";
import { User } from "../../domain/user.entity";

export class AuthRepo {
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    return doc
      ? User.rehydrate({
          id: doc._id.toString(),
          email: doc.email,
          username: doc.username,
          passwordHash: doc.password,
          roles: doc.roles,
          createdAt: doc.createdAt,
        })
      : null;
  }

  async findByUserName(username: string): Promise<User | null> {
    const doc = await UserModel.findOne({ username });
    return doc
      ? User.rehydrate({
          id: doc._id.toString(),
          email: doc.email,
          username: doc.username,
          passwordHash: doc.password,
          roles: doc.roles,
          createdAt: doc.createdAt,
        })
      : null;
  }

  async create(data: {
    email: string;
    username: string;
    password: string;
    roles?: string[];
    createdAt?: Date;
  }): Promise<UserDocument> {
    return UserModel.create(data);
  }
}

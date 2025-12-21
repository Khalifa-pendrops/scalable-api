// we will prevent DB logic leaking everywhere
//easier testing and migrations
// keeps service layer clean and concise
// this is purely DB abstraction

import { UserModel, UserDocument } from "./auth.model";
import { PersistedUser } from "./auth.types";
import { UserProps } from "../../domain/user.entity";

export class AuthRepo {
  async findByEmail(email: string): Promise<PersistedUser | null> {
    const doc = await UserModel.findOne({ email }).lean<UserDocument>();
    if (!doc) return null;

    return {
      _id: doc._id.toString(),
      email: doc.email,
      username: doc.username,
      roles: doc.roles,
      createdAt: doc.createdAt,
    };
  }

  async findByUserName(username: string): Promise<PersistedUser | null> {
    const doc = await UserModel.findOne({ username }).lean<UserDocument>();
    if (!doc) return null;

    return {
      _id: doc._id.toString(),
      email: doc.email,
      username: doc.username,
      roles: doc.roles,
      createdAt: doc.createdAt,
    };
  }

  async create(userData: UserProps): Promise<PersistedUser> {
    const doc = await UserModel.create(userData);

    return {
      _id: doc._id.toString(),
      email: doc.email,
      username: doc.username,
      roles: doc.roles,
      createdAt: doc.createdAt,
    };
  }
}

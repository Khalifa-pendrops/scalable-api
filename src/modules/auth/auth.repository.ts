// we will prevent DB logic leaking everywhere
// easier testing and migrations
// keeps service layer clean and concise
// this is purely DB abstraction

import { UserModel, UserDocument } from "./auth.model";
import { CreateUserDTO } from "./auth.types";

export class AuthRepo {
  async findByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  async findByUserName(username: string) {
    return UserModel.findOne({ username });
  }

  async create(userData: CreateUserDTO) {
    return UserModel.create(userData);
  }
}

//decisions

import { User } from "../../domain/user.entity";
import { AuthRepo } from "./auth.repository";


export class AuthService {
  constructor(private repo = new AuthRepo()) {}

  async register(email: string, username: string, password: string) {
    const existing =
      (await this.repo.findByEmail(email)) ||
      (await this.repo.findByEmail(username));

    if (existing) {
      throw new Error(
        "Ooops! A user with this email and/or username already exist"
      );
    }

    const user = await User.create({ email, username, password });

    return this.repo.create(user.persistence);
  }
}

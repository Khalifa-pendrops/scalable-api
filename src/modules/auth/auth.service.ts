//decisions

import { User } from "../../domain/user.entity";
import { AuthRepo } from "./auth.repository";
import { PersistedUser } from "./auth.types";

export class AuthService {
  constructor(private repo = new AuthRepo()) {}

  async register(email: string, username: string, password: string): Promise<PersistedUser> {
    const existing =
      (await this.repo.findByEmail(email)) ||
      (await this.repo.findByEmail(username));

    if (existing) {
      throw new Error(
        "Ooops! A user with this email and/or username already exist"
      );
    }

    const user = new User({ email, username, password });

    await user.hashPassword();

    return this.repo.create(user.values);
  }
}

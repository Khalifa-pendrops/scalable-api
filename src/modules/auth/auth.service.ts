// decisions

import { User } from "../../domain/user.entity";
import { AuthRepo } from "./auth.repository";
import { RefreshTokenModel } from "./refreshToken.model";
import { generateRefreshToken, hashRefreshToken } from "../../utils/token";
import { signAccessToken } from "../../utils/jwt";

export class AuthService {
  constructor(private repo = new AuthRepo()) {}

  async register(params: {
    email: string;
    username: string;
    password: string;
  }) {
    const { email, username } = params;


    const existing =
      (await this.repo.findByEmail(email)) ||
      (await this.repo.findByUserName(username));

    if (existing) {
      throw new Error(
        "Ooops! A user with this email and/or username already exists"
      );
    }

    // domain creation
    const user = await User.create(params);

    // persistence
    const doc = await this.repo.create(user.persistence);

    // rehydrate WITH id
    return User.rehydrate({
      id: doc._id.toString(),
      email: doc.email,
      username: doc.username,
      passwordHash: doc.password,
      roles: doc.roles,
      createdAt: doc.createdAt,
    });
  }

  async login(
    identifier: string,
    password: string,
    meta: { ip?: string; userAgent?: string }
  ) {
    const user =
      (await this.repo.findByEmail(identifier)) ||
      (await this.repo.findByUserName(identifier));

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const accessToken = signAccessToken({
      sub: user.id!, // domain id
      roles: user.roles,
    });

    const refreshToken = generateRefreshToken();

    await RefreshTokenModel.create({
      userId: user.id!,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      userAgent: meta.userAgent,
      ip: meta.ip,
    });

    return { accessToken, refreshToken };
  }
}

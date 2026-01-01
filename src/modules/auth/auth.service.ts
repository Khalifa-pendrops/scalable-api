// decisions

import { User } from "../../domain/user.entity";
import { AuthRepo } from "./auth.repository";
import { RefreshTokenModel } from "./refreshToken.model";
import { generateRefreshToken, hashRefreshToken } from "../../utils/token";
import { signAccessToken } from "../../utils/jwt";
import { RefreshTokenRepo } from "./auth.refreshToken.repository";
import { AuthError } from "../../error/auth.error";

export class AuthService {
  constructor(
    private repo = new AuthRepo(),
    private refreshTokenRepo = new RefreshTokenRepo()
  ) {}

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
      sub: user.id!,
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

  async refresh(
    refreshToken: string,
    meta: { ip?: string; userAgent?: string }
  ) {
    const tokenHash = hashRefreshToken(refreshToken);

    // Find token (even if revoked) for replay detection
    const stored = await this.refreshTokenRepo.findByHash(tokenHash);

    // Token never existed
    if (!stored) {
      throw new AuthError("Umm sorry this refresh token is invalid");
    }

    // If token is revoked => replay detected
    if (stored.revokedAt || stored.expiresAt < new Date()) {
      await this.refreshTokenRepo.revokeAllForUser(stored.userId.toString());
      throw new Error("🚨Security incident detected. Session terminated!");
    }

    // Revoke old token (rotation)
    await this.refreshTokenRepo.revoke(stored._id.toString());

    // Issue new access token
    const accessToken = signAccessToken({
      sub: stored.userId.toString(),
      roles: [], // optionally fetch roles from DB
    });

    // Issue new refresh token and store hash
    const newRefreshToken = generateRefreshToken();

    await this.refreshTokenRepo.create({
      userId: stored.userId.toString(),
      tokenHash: hashRefreshToken(newRefreshToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  // idempotent - safe to call twice
  // no info leakage and no access token required
  async logout(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);

    const stored = await this.refreshTokenRepo.findValidByHash(tokenHash);

    if (!stored) {
      //idempotent logout - already revoked or invalid
      return;
    }
  }

  async logoutAll(userId: string) {
    await this.refreshTokenRepo.revokeAllForUser(userId);
  }
}

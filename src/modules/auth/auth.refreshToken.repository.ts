// Persistence, no logic

import { RefreshTokenModel } from "./refreshToken.model";

export class RefreshTokenRepo {
  // Used for replay detection (returns token even if revoked/expired)
  async findByHash(tokenHash: string) {
    return RefreshTokenModel.findOne({ tokenHash });
  }

  // Used for normal refresh flow (valid token only)
  async findValidByHash(tokenHash: string) {
    return RefreshTokenModel.findOne({
      tokenHash,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });
  }

  async revoke(tokenId: string) {
    return RefreshTokenModel.updateOne(
      { _id: tokenId, revokedAt: null }, // prevents re-revoking 
      { revokedAt: new Date() }
    );
  }

  async revokeAllForUser(userId: string) {
    return RefreshTokenModel.updateMany(
      { userId, revokedAt: null },
      { revokedAt: new Date() }
    );
  }

  async create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    userAgent?: string;
    ip?: string;
  }) {
    return RefreshTokenModel.create(data);
  }
}

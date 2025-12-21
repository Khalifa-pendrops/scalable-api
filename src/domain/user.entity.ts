// i don't trust raw request data. so i validate here before persisting to DB
// enforce password rules here, hash password here and encapsulate comparison
// at no point must a User object contain a raw password

import bcrypt from "bcrypt";


interface CreateUserParams {
  email: string;
  username: string;
  password: string;
}

export interface UserProps {
  // id?: string;
  email: string;
  username: string;
  passwordHash: string;
  roles?: string[];
  createdAt?: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static async create(params: CreateUserParams): Promise<User> {
    if (!params.email || !params.email.includes("@")) {
      throw new Error("This email is invalid. Add a valid email.");
    }
    if (!params.username || params.username.length < 3) {
      throw new Error("This username is too short. Add some more letter.");
    }
    if (!params.password || params.password.length < 8) {
      throw new Error("Hey! This password is too weak. You know what to do.");
    }

    const passwordHash = await bcrypt.hash(params.password, 12);

    return new User({
      email: params.email,
      username: params.username,
      passwordHash,
      roles: ["user"],
      createdAt: new Date(),
    });
  }

  async comparePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.props.passwordHash);
  }

  get persistence() {
    return {
      email: this.props.email,
      username: this.props.username,
      password: this.props.passwordHash,
      roles: this.props.roles,
      createdAt: this.props.createdAt,
    };
  }
}

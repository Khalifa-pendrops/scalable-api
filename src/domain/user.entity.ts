// i don't trust raw request data. so i validate here before persisting to DB
// enforce password rules here, hash password here and encapsulate comparison

import bcrypt from "bcrypt";

export interface UserProps {
  id?: string;
  email: string;
  username: string;
  password: string;
  roles?: string[];
  createdAt?: Date;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.validate(props);
    this.props = {
      ...props,
      roles: props.roles ?? ["user"],
      createdAt: props.createdAt ?? new Date(),
    };
  }

  private validate(props: UserProps) {
    if (!props.email || !props.email.includes("@")) {
      throw new Error("This email is invalid. Add a valid email.");
    }
    if (!props.username || props.username.length < 3) {
      throw new Error("This username is too short. Add some more letter.");
    }
    if (!props.password || props.password.length < 8) {
      throw new Error("Hey! This password is too weak. You know what to do.");
    }
  }

  async hashPassword() {
    this.props.password = await bcrypt.hash(this.props.password, 12);
  }

  async comparePassword(plain: string) {
    return bcrypt.compare(plain, this.props.password);
  }

  get values() {
    return {
      id: this.props.id,
      email: this.props.email,
      username: this.props.username,
      password: this.props.password,
      roles: this.props.roles,
      createdAt: this.props.createdAt,
    };
  }
}

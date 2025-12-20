import bcrypt from "bcrypt";

export interface UserProps {
  id?: string;
  email: string;
  username: string;
  password: string;
  roles?: string[];
  createdAt?: Date;
}

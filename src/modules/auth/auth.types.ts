export interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
  roles: string[];
  createdAt: Date;
}

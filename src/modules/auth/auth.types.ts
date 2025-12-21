export interface PersistedUser {
  _id: string;
  email: string;
  username: string;
  roles: string[];
  createdAt: Date;
}

import { User } from "../../entity/User";

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  getUserById(userId: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(userData: { name: string; email: string }): Promise<User>;
  updateUser(userId: string, userData: Partial<User>): Promise<User | null>;
  deleteUser(userId: string): Promise<boolean>;
}

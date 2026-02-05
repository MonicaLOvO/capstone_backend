import { User } from "../../entity/User";

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(userData: { name: string; email: string }): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
}

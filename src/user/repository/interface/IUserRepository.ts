import { User } from "../../entity/User";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: Partial<User>): Promise<User>;
  update(userId: string, userData: Partial<User>): Promise<User | null>;
  delete(userId: string): Promise<boolean>;
}

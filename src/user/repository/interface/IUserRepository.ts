import { User } from "../../entity/User";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: Partial<User>): Promise<User>;
  update(id: number, userData: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}

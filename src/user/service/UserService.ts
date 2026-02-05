import { injectable, inject } from "tsyringe";
import { UserRepository } from "../repository/UserRepository";
import { User } from "../entity/User";
import { IUserService } from "./interface/IUserService";

export { IUserService };

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async createUser(userData: { name: string; email: string }): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    return await this.userRepository.create({
      ...userData,
    });
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    return await this.userRepository.update(id, userData);
  }

  async deleteUser(id: number): Promise<boolean> {
    return await this.userRepository.delete(id);
  }
}


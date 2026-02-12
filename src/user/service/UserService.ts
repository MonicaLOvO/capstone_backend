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

  async getUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findById(userId);
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
      Name: userData.name,
      Email: userData.email,
    });
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User | null> {
    return await this.userRepository.update(userId, userData);
  }

  async deleteUser(userId: string): Promise<boolean> {
    return await this.userRepository.delete(userId);
  }
}


import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../entity/User";
import { IUserRepository } from "./interface/IUserRepository";

export { IUserRepository };

@injectable()
export class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    Object.assign(user, userData);
    return await this.repository.save(user);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}


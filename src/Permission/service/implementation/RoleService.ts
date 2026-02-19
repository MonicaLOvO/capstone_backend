import { inject, injectable } from "tsyringe";
import { IRoleService } from "../interface/IRoleService";
import { RoleRepository } from "../../repository/RoleRepository";
import { IRoleMapperService } from "../interface/mapper/IRoleMapperService";
import { RoleModel } from "../../model/RoleModel";
import { UpsertRoleDto } from "../../dto/UpsertRole";
import { Role } from "../../entity/Role";

export { IRoleService };

@injectable()
export class RoleService extends IRoleService {
  constructor(
    @inject(IRoleMapperService.name) private readonly mapper: IRoleMapperService,
    @inject(RoleRepository) private readonly roleRepository: RoleRepository
  ) {
    super();
  }

  async GetRoles(query?: Record<string, string>): Promise<[RoleModel[], number]> {
    const entities = await this.roleRepository.GetRoles(query) as Role[];
    const total = await this.roleRepository.GetRoles(query, true) as number;
    const models = entities.map(entity => this.mapper.MapEntityToModel(entity));
    return [models, total];
  }

  async GetRoleById(id: string): Promise<RoleModel | null> {
    const entity = await this.roleRepository.GetRoleById(id);
    return entity ? this.mapper.MapEntityToModel(entity) : null;
  }

  async CreateRole(dto: UpsertRoleDto): Promise<string> {
    const newId = await this.roleRepository.AddRole(dto);
    if (!newId) {
      throw new Error("Failed to create role");
    }
    return newId;
  }

  async UpdateRole(dto: UpsertRoleDto): Promise<string> {
    const updatedId = await this.roleRepository.UpdateRole(dto);
    if (!updatedId) {
      throw new Error("Failed to update role");
    }
    return updatedId;
  }

  async DeleteRole(id: string): Promise<string> {
    const deletedId = await this.roleRepository.DeleteRole(id);
    if (!deletedId) {
      throw new Error("Failed to delete role");
    }
    return deletedId;
  }
}

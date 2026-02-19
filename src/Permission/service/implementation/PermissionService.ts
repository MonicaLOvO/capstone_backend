import { inject, injectable } from "tsyringe";
import { IPermissionService } from "../interface/IPermissionService";
import { PermissionRepository } from "../../repository/PermissionRepository";
import { IPermissionMapperService } from "../interface/mapper/IPermissionMapperService";
import { PermissionModel } from "../../model/PermissionModel";
import { UpsertPermissionDto } from "../../dto/UpsertPermission";
import { Permission } from "../../entity/Permission";

export { IPermissionService };

@injectable()
export class PermissionService extends IPermissionService {
  constructor(
    @inject(IPermissionMapperService.name) private readonly mapper: IPermissionMapperService,
    @inject(PermissionRepository) private readonly permissionRepository: PermissionRepository
  ) {
    super();
  }

  async GetPermissions(query?: Record<string, string>): Promise<[PermissionModel[], number]> {
    const entities = await this.permissionRepository.GetPermissions(query) as Permission[];
    const total = await this.permissionRepository.GetPermissions(query, true) as number;
    const models = entities.map(entity => this.mapper.MapEntityToModel(entity));
    return [models, total];
  }

  async GetPermissionById(id: string): Promise<PermissionModel | null> {
    const entity = await this.permissionRepository.GetPermissionById(id);
    return entity ? this.mapper.MapEntityToModel(entity) : null;
  }

  async CreatePermission(dto: UpsertPermissionDto): Promise<string> {
    const newId = await this.permissionRepository.AddPermission(dto);
    if (!newId) {
      throw new Error("Failed to create permission");
    }
    return newId;
  }

  async UpdatePermission(dto: UpsertPermissionDto): Promise<string> {
    const updatedId = await this.permissionRepository.UpdatePermission(dto);
    if (!updatedId) {
      throw new Error("Failed to update permission");
    }
    return updatedId;
  }

  async DeletePermission(id: string): Promise<string> {
    const deletedId = await this.permissionRepository.DeletePermission(id);
    if (!deletedId) {
      throw new Error("Failed to delete permission");
    }
    return deletedId;
  }
}

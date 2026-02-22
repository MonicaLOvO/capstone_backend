import { inject, injectable } from "tsyringe";
import { IRolePermissionService } from "../interface/IRolePermissionService";
import { RolePermissionRepository } from "../../repository/RolePermissionRepository";
import { IPermissionMapperService } from "../interface/mapper/IPermissionMapperService";
import { UpsertRolePermissionDto } from "../../dto/UpsertRolePermission";
import { RolePermission } from "../../entity/RolePermission";
import { PermissionModel } from "../../model/PermissionModel";

export { IRolePermissionService };

@injectable()
export class RolePermissionService extends IRolePermissionService {
  constructor(
    @inject(IPermissionMapperService.name) private readonly permissionMapper: IPermissionMapperService,
    @inject(RolePermissionRepository) private readonly rolePermissionRepository: RolePermissionRepository
  ) {
    super();
  }

  async GetPermissionsByRoleId(roleId: string, query?: Record<string, string>): Promise<[PermissionModel[], number]> {
    const entries = await this.rolePermissionRepository.GetPermissionsByRoleId(roleId, query) as RolePermission[];
    const total = await this.rolePermissionRepository.GetPermissionsByRoleId(roleId, query, true) as number;
    const models = entries
      .filter(e => e.Permission)
      .map(e => {
        return this.permissionMapper.MapEntityToModel(e.Permission as any);
      });
    return [models, total];
  }

  async AssignPermission(dto: UpsertRolePermissionDto): Promise<string> {
    // TODO: Check permission Id is good
    if (!dto.PermissionId) {
      throw new Error("PermissionId is required");
    }
    const entry = await this.rolePermissionRepository.AddRolePermission(dto.RoleId, dto.PermissionId);
    return `Assigned permission ${entry.PermissionId} to role ${entry.RoleId}`;
  }

  async AssignBulkPermissions(dto: UpsertRolePermissionDto): Promise<number> {
    // Check permission Id is good
    if (!dto.PermissionIds || dto.PermissionIds.length === 0) {
      throw new Error("PermissionIds array is required");
    }
    return await this.rolePermissionRepository.AddBulkRolePermissions(dto.RoleId, dto.PermissionIds);
  }

  async RemovePermission(roleId: string, permissionId: string): Promise<string> {
    // TODO: Check if the permission is already removed, Check user permission to remove
    await this.rolePermissionRepository.RemoveRolePermission(roleId, permissionId);
    return `Removed permission ${permissionId} from role ${roleId}`;
  }

  async UpsertPermissions(dto: UpsertRolePermissionDto): Promise<number> {
    // TODO: Check if the permission is already removed, Check user permission to remove
    // Check roleId
    // Check permission list
    if (!dto.PermissionIds) {
      throw new Error("PermissionIds array is required");
    }
    return await this.rolePermissionRepository.UpsertRolePermissions(dto.RoleId, dto.PermissionIds);

    // TODO: Find all user using the role and invalidate the token
  }
}

import { inject, injectable } from "tsyringe";
import { IRolePermissionService } from "../interface/IRolePermissionService";
import { RolePermissionRepository } from "../../repository/RolePermissionRepository";
import { IPermissionMapperService } from "../interface/mapper/IPermissionMapperService";
import { RolePermissionModel } from "../../model/RolePermissionModel";
import { UpsertRolePermissionDto } from "../../dto/UpsertRolePermission";
import { RolePermission } from "../../entity/RolePermission";

export { IRolePermissionService };

@injectable()
export class RolePermissionService extends IRolePermissionService {
  constructor(
    @inject(IPermissionMapperService.name) private readonly permissionMapper: IPermissionMapperService,
    @inject(RolePermissionRepository) private readonly rolePermissionRepository: RolePermissionRepository
  ) {
    super();
  }

  async GetPermissionsByRoleId(roleId: string, query?: Record<string, string>): Promise<[RolePermissionModel[], number]> {
    const entries = await this.rolePermissionRepository.GetPermissionsByRoleId(roleId, query) as RolePermission[];
    const total = await this.rolePermissionRepository.GetPermissionsByRoleId(roleId, query, true) as number;
    const models = entries
      .filter(e => e.Permission)
      .map(e => {
        const model = Object.assign(new RolePermissionModel(), this.permissionMapper.MapEntityToModel(e.Permission as any));
        model.ExpiresAt = e.ExpiresAt ?? null;
        return model;
      });
    return [models, total];
  }

  async AssignPermission(dto: UpsertRolePermissionDto): Promise<string> {
    if (!dto.PermissionId) {
      throw new Error("PermissionId is required");
    }
    const expiresAt = dto.ExpiresAt ? new Date(dto.ExpiresAt) : undefined;
    const entry = await this.rolePermissionRepository.AddRolePermission(dto.RoleId, dto.PermissionId, expiresAt);
    return `Assigned permission ${entry.PermissionId} to role ${entry.RoleId}`;
  }

  async AssignBulkPermissions(dto: UpsertRolePermissionDto): Promise<number> {
    if (!dto.PermissionIds || dto.PermissionIds.length === 0) {
      throw new Error("PermissionIds array is required");
    }
    const expiresAt = dto.ExpiresAt ? new Date(dto.ExpiresAt) : undefined;
    return await this.rolePermissionRepository.AddBulkRolePermissions(dto.RoleId, dto.PermissionIds, expiresAt);
  }

  async RemovePermission(roleId: string, permissionId: string): Promise<string> {
    await this.rolePermissionRepository.RemoveRolePermission(roleId, permissionId);
    return `Removed permission ${permissionId} from role ${roleId}`;
  }

  async ReplacePermissions(dto: UpsertRolePermissionDto): Promise<number> {
    if (!dto.PermissionIds) {
      throw new Error("PermissionIds array is required");
    }
    const expiresAt = dto.ExpiresAt ? new Date(dto.ExpiresAt) : undefined;
    return await this.rolePermissionRepository.ReplaceRolePermissions(dto.RoleId, dto.PermissionIds, expiresAt);
  }
}

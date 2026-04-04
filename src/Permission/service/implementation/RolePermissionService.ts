import { inject, injectable } from "tsyringe";
import { IRolePermissionService } from "../interface/IRolePermissionService";
import { RolePermissionRepository } from "../../repository/RolePermissionRepository";
import { IPermissionMapperService } from "../interface/mapper/IPermissionMapperService";
import { UpsertRolePermissionDto } from "../../dto/UpsertRolePermission";
import { RolePermission } from "../../entity/RolePermission";
import { PermissionModel } from "../../model/PermissionModel";
import { IPermissionService } from "../interface/IPermissionService";
import { IRoleService } from "../interface/IRoleService";

export { IRolePermissionService };

@injectable()
export class RolePermissionService extends IRolePermissionService {
  constructor(
    @inject(IRoleService.name) private readonly roleService: IRoleService,
    @inject(IPermissionService.name) private readonly permissionService: IPermissionService,
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

  async UpsertPermissions(dto: UpsertRolePermissionDto): Promise<number> {
    // Check permission Id is good
    const permissionCheckList = await Promise.all(dto.PermissionIds?.map( async (id) => await this.permissionService.GetPermissionById(id)) ?? []);
    if(!dto.PermissionIds || permissionCheckList?.some(p => p == null))
    {
      throw new Error("One or more permissions not found");
    }
    const roleCheck = await this.roleService.GetRoleById(dto.RoleId);
    if(!roleCheck)
    {
      throw new Error("Role not found or deleted");
    }

    return await this.rolePermissionRepository.UpsertRolePermissions(dto.RoleId, dto.PermissionIds);

    // TODO: Find all user using the role and invalidate the token

    
  }
}

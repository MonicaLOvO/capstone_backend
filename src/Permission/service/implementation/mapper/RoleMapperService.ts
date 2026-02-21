import { injectable } from "tsyringe";
import { Role } from "../../../entity/Role";
import { RoleModel } from "../../../model/RoleModel";
import { PermissionModel } from "../../../model/PermissionModel";
import { IRoleMapperService } from "../../interface/mapper/IRoleMapperService";
import { PermissionActionEnum } from "../../../enum/PermissionActionEnum";
import { PermissionModuleEnum } from "../../../enum/PermissionModuleEnum";

export { IRoleMapperService };

@injectable()
export class RoleMapperService extends IRoleMapperService {

    MapEntityToModel(entity: Role): RoleModel {
        const model = Object.assign<RoleModel, Partial<RoleModel>>(new RoleModel(), {
            Id: entity.Id,
            RoleName: entity.RoleName,
            Description: entity.Description ?? "",
        });

        if (entity.RolePermissions && entity.RolePermissions.length > 0) {
            model.Permissions = entity.RolePermissions.map(rp => {
                return Object.assign<PermissionModel, Partial<PermissionModel>>(new PermissionModel(), {
                    Id: rp.Permission?.Id ,
                    PermissionAction: rp.Permission?.PermissionAction,
                    Module: rp.Permission?.Module,
                    Description: rp.Permission?.Description ?? "",
                });
            });
        }

        return model;
    }
}

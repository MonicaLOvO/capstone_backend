import { injectable } from "tsyringe";
import { Role } from "../../../entity/Role";
import { RoleModel } from "../../../model/RoleModel";
import { PermissionModel } from "../../../model/PermissionModel";
import { IRoleMapperService } from "../../interface/mapper/IRoleMapperService";

export { IRoleMapperService };

@injectable()
export class RoleMapperService extends IRoleMapperService {

    MapEntityToModel(entity: Role): RoleModel {
        const model = Object.assign<RoleModel, Partial<RoleModel>>(new RoleModel(), {
            RoleId: entity.RoleId,
            RoleName: entity.RoleName,
            Description: entity.Description ?? "",
        });

        if (entity.RolePermissions && entity.RolePermissions.length > 0) {
            model.Permissions = entity.RolePermissions.map(rp => {
                return Object.assign<PermissionModel, Partial<PermissionModel>>(new PermissionModel(), {
                    PermissionId: rp.Permission?.PermissionId ?? rp.PermissionId,
                    PermissionName: rp.Permission?.PermissionName ?? "",
                    Module: rp.Permission?.Module ?? "",
                    Description: rp.Permission?.Description ?? "",
                });
            });
        }

        return model;
    }
}

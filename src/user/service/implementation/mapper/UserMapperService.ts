import { inject, injectable } from "tsyringe";
import { User } from "../../../entity/User";
import { UserModel } from "../../../model/UserModel";
import { DepartmentModel } from "../../../model/DepartmentModel";
import { RoleModel } from "../../../../Permission/model/RoleModel";
import { IUserMapperService } from "../../interface/mapper/IUserMapperService";
import { IPermissionMapperService } from "../../../../Permission/service/interface/mapper/IPermissionMapperService";

export { IUserMapperService };

@injectable()
export class UserMapperService extends IUserMapperService {
    constructor(
        @inject(IPermissionMapperService.name) private readonly permissionMapper: IPermissionMapperService
    ) {
        super();
    }

    MapEntityToModel(entity: User): UserModel {
        const model = Object.assign<UserModel, Partial<UserModel>>(new UserModel(), {
            Id: entity.Id,
            Username: entity.Username,
            Email: entity.Email,
            FirstName: entity.FirstName ?? "",
            LastName: entity.LastName ?? "",
            IsActive: entity.IsActive,
            CreatedAt: entity.CreatedAt,
            UpdatedAt: entity.UpdatedAt,
            CreatedBy: entity.CreatedBy ?? "",
            UpdatedBy: entity.UpdatedBy ?? "",
        });

        if (entity.Department) {
            model.Department = Object.assign<DepartmentModel, Partial<DepartmentModel>>(new DepartmentModel(), {
                Id: entity.Department.Id,
                DepartmentName: entity.Department.DepartmentName,
                Description: entity.Department.Description ?? "",
                IsActive: entity.Department.IsActive,
            });
        }

        if (entity.Role) {
            model.Role = Object.assign<RoleModel, Partial<RoleModel>>(new RoleModel(), {
                Id: entity.Role.Id,
                RoleName: entity.Role.RoleName,
                Description: entity.Role.Description ?? "",
            });
            model.Role.Permissions = entity.Role.RolePermissions && entity.Role.RolePermissions.length > 0 ? 
            entity.Role.RolePermissions.filter(rp => rp.Permission)
            .map(rp => {
                return this.permissionMapper.MapEntityToModel(rp.Permission);
            }) 
            : []; 

        } else {
            model.Role = null;
        }

        return model;
    }
}

import { injectable } from "tsyringe";
import { User } from "../../../entity/User";
import { UserModel } from "../../../model/UserModel";
import { DepartmentModel } from "../../../model/DepartmentModel";
import { RoleModel } from "../../../../Permission/model/RoleModel";
import { IUserMapperService } from "../../interface/mapper/IUserMapperService";

export { IUserMapperService };

@injectable()
export class UserMapperService extends IUserMapperService {

    MapEntityToModel(entity: User): UserModel {
        const model = Object.assign<UserModel, Partial<UserModel>>(new UserModel(), {
            Id: entity.Id,
            Username: entity.Username,
            Email: entity.Email,
            FirstName: entity.FirstName ?? "",
            LastName: entity.LastName ?? "",
            IsActive: entity.IsActive,
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
        }

        return model;
    }
}

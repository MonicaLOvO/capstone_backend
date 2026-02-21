import { DepartmentModel } from "./DepartmentModel";
import { RoleModel } from "../../Permission/model/RoleModel";

export class UserModel {
    Id!: string;
    Username?: string;
    Email?: string;
    FirstName?: string;
    LastName?: string;
    Department?: DepartmentModel;
    Role?: RoleModel;
    IsActive?: boolean;
}

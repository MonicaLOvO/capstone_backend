import { DepartmentModel } from "./DepartmentModel";
import { RoleModel } from "../../Permission/model/RoleModel";
import { MediaModel } from "../../media/model/MediaModel";

export class UserModel {
    Id!: string;
    Username?: string;
    Email?: string;
    FirstName?: string;
    LastName?: string;
    MediaAssets?: MediaModel[];
    Department?: DepartmentModel;
    Role?: RoleModel | null;
    IsActive?: boolean;
    CreatedAt?: Date;
    UpdatedAt?: Date;
    CreatedBy?: string;
    UpdatedBy?: string;
}

import { UpsertRoleDto } from "../../dto/UpsertRole";
import { RoleModel } from "../../model/RoleModel";

export abstract class IRoleService {
    abstract GetRoles(query?: Record<string, string>): Promise<[RoleModel[], number]>;
    abstract GetRoleById(id: string): Promise<RoleModel | null>;
    abstract CreateRole(dto: UpsertRoleDto): Promise<string>;
    abstract UpdateRole(dto: UpsertRoleDto): Promise<string>;
    abstract DeleteRole(id: string): Promise<string>;
}

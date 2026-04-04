import { DataSource } from "typeorm";
import { Permission } from "../../Permission/entity/Permission";
import { Role } from "../../Permission/entity/Role";
import { RolePermission } from "../../Permission/entity/RolePermission";
import { PermissionActionEnum } from "../../Permission/enum/PermissionActionEnum";
import { PermissionModuleEnum } from "../../Permission/enum/PermissionModuleEnum";

type PermissionSpec = {
    module: PermissionModuleEnum;
    action: PermissionActionEnum;
};

type RoleSeedSpec = {
    roleName: string;
    description: string;
    permissions?: PermissionSpec[];
    allPermissions?: boolean;
};

const ROLE_SEED_CONFIG: RoleSeedSpec[] = [
    {
        roleName: "Staff",
        description: "Basic staff access.",
        permissions: [
            { module: PermissionModuleEnum.INVENTORY, action: PermissionActionEnum.READ },
            { module: PermissionModuleEnum.INVENTORY, action: PermissionActionEnum.VIEW },
            { module: PermissionModuleEnum.ORDER, action: PermissionActionEnum.VIEW },
            { module: PermissionModuleEnum.ORDER, action: PermissionActionEnum.READ },
            { module: PermissionModuleEnum.ORDER, action: PermissionActionEnum.UPDATE },
        ],
    },
    {
        roleName: "Manager",
        description: "Can view and edit inventory, orders, and manage staff (People).",
        permissions: [
            { module: PermissionModuleEnum.INVENTORY, action: PermissionActionEnum.READ },
            { module: PermissionModuleEnum.INVENTORY, action: PermissionActionEnum.VIEW },
            { module: PermissionModuleEnum.INVENTORY, action: PermissionActionEnum.CREATE },
            { module: PermissionModuleEnum.INVENTORY, action: PermissionActionEnum.UPDATE },
            { module: PermissionModuleEnum.INVENTORY, action: PermissionActionEnum.DELETE },
            { module: PermissionModuleEnum.ORDER, action: PermissionActionEnum.VIEW },
            { module: PermissionModuleEnum.ORDER, action: PermissionActionEnum.READ },
            { module: PermissionModuleEnum.ORDER, action: PermissionActionEnum.CREATE },
            { module: PermissionModuleEnum.ORDER, action: PermissionActionEnum.UPDATE },
            { module: PermissionModuleEnum.ORDER, action: PermissionActionEnum.DELETE },
            { module: PermissionModuleEnum.USER, action: PermissionActionEnum.VIEW },
            { module: PermissionModuleEnum.USER, action: PermissionActionEnum.READ },
            { module: PermissionModuleEnum.USER, action: PermissionActionEnum.CREATE },
            { module: PermissionModuleEnum.USER, action: PermissionActionEnum.UPDATE },
            { module: PermissionModuleEnum.USER, action: PermissionActionEnum.DELETE },
            { module: PermissionModuleEnum.ROLE, action: PermissionActionEnum.VIEW },
        ],
    },
    {
        roleName: "Admin",
        description: "Business administrator with the same application access as SuperAdmin.",
        allPermissions: true,
    },
];

function permissionKey(permission: Permission): string {
    return `${permission.Module}::${permission.PermissionAction}`;
}

function permissionSpecKey(spec: PermissionSpec): string {
    return `${spec.module}::${spec.action}`;
}

export async function seedRoles(dataSource: DataSource): Promise<void> {
    const roleRepo = dataSource.getRepository(Role);
    const permissionRepo = dataSource.getRepository(Permission);
    const rolePermissionRepo = dataSource.getRepository(RolePermission);

    const allPermissions = await permissionRepo.find();
    const permissionMap = new Map(allPermissions.map((permission) => [permissionKey(permission), permission]));

    for (const roleConfig of ROLE_SEED_CONFIG) {
        let role = await roleRepo.findOne({ where: { RoleName: roleConfig.roleName } });

        if (!role) {
            role = roleRepo.create({
                RoleName: roleConfig.roleName,
                Description: roleConfig.description,
            });
            role = await roleRepo.save(role);
            console.log(`Seeded role: ${roleConfig.roleName}`);
        }

        const targetPermissions = roleConfig.allPermissions
            ? allPermissions
            : (roleConfig.permissions ?? [])
                  .map((spec) => permissionMap.get(permissionSpecKey(spec)))
                  .filter((permission): permission is Permission => Boolean(permission));

        if (targetPermissions.length === 0) {
            continue;
        }

        const existingLinks = await rolePermissionRepo.find({
            where: { RoleId: role.Id },
        });
        const linkedPermissionIds = new Set(existingLinks.map((link) => link.PermissionId));

        const newLinks = targetPermissions
            .filter((permission) => !linkedPermissionIds.has(permission.Id))
            .map((permission) =>
                rolePermissionRepo.create({
                    RoleId: role.Id,
                    PermissionId: permission.Id,
                })
            );

        if (newLinks.length > 0) {
            await rolePermissionRepo.save(newLinks);
            console.log(`Seeded ${newLinks.length} role-permission links for ${roleConfig.roleName}`);
        }
    }
}

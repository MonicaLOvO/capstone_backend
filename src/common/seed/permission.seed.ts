import { DataSource, In } from "typeorm";
import { Permission } from "../../Permission/entity/Permission";
import { Role } from "../../Permission/entity/Role";
import { RolePermission } from "../../Permission/entity/RolePermission";
import { PermissionActionEnum } from "../../Permission/enum/PermissionActionEnum";
import { PermissionModuleEnum } from "../../Permission/enum/PermissionModuleEnum";
import { User } from "../../user/entity/User";
import bcrypt from "bcryptjs";
import { SALT_ROUNDS } from "../config/jwt.config";

const ADMIN_ROLE_NAME = "SuperAdmin";

export async function seedPermissions(dataSource: DataSource): Promise<void> {
    const permissionRepo = dataSource.getRepository(Permission);
    const roleRepo = dataSource.getRepository(Role);
    const rolePermissionRepo = dataSource.getRepository(RolePermission);
    const userRepo = dataSource.getRepository(User);

    const modules = Object.values(PermissionModuleEnum);
    const actions = Object.values(PermissionActionEnum);

    // --- Seed Permissions (Module x Action) ---
    const existingPermissions = await permissionRepo.find();
    const existingSet = new Set(
        existingPermissions.map((p) => `${p.Module}::${p.PermissionAction}`)
    );

    const newPermissions: Permission[] = [];
    for (const module of modules) {
        for (const action of actions) {
            if (!existingSet.has(`${module}::${action}`)) {
                const permission = permissionRepo.create({
                    Module: module,
                    PermissionAction: action,
                    Description: `${action} access for ${module} module`,
                });
                newPermissions.push(permission);
            }
        }
    }

    if (newPermissions.length > 0) {
        await permissionRepo.save(newPermissions);
        console.log(`Seeded ${newPermissions.length} new permissions`);
    }

    

    // --- Seed Admin Role ---
    let adminRole = await roleRepo.findOne({ where: { RoleName: ADMIN_ROLE_NAME } });
    if (!adminRole) {
        adminRole = roleRepo.create({
            RoleName: ADMIN_ROLE_NAME,
            Description: "Administrator with full access to all modules",
        });
        adminRole = await roleRepo.save(adminRole);
        console.log("Seeded Admin role");
    }
    

    // --- Seed RolePermissions (Admin -> all permissions) ---
    const allPermissions = await permissionRepo.find();
    const existingLinks = await rolePermissionRepo.find({
        where: { RoleId: adminRole.Id },
    });
    const linkedPermissionIds = new Set(existingLinks.map((rp) => rp.PermissionId));

    const newLinks: RolePermission[] = [];
    for (const permission of allPermissions) {
        if (!linkedPermissionIds.has(permission.Id)) {
            const link = rolePermissionRepo.create({
                RoleId: adminRole.Id,
                PermissionId: permission.Id,
            });
            newLinks.push(link);
        }
    }

    if (newLinks.length > 0) {
        await rolePermissionRepo.save(newLinks);
        console.log(`Seeded ${newLinks.length} new role-permission links for Admin`);
    }

    // --- Seed SuperAdmin User ---
    let superAdminUser = await userRepo.findOne({ where: { Username: ADMIN_ROLE_NAME } });
    if (!superAdminUser) {
        superAdminUser = userRepo.create({
            Username: ADMIN_ROLE_NAME,
            Email: `${ADMIN_ROLE_NAME}@${ADMIN_ROLE_NAME}.com`,
            PasswordHash: await bcrypt.hash(ADMIN_ROLE_NAME, SALT_ROUNDS),
            Role: { Id: adminRole.Id },
            IsActive: true,
        });
        superAdminUser = await userRepo.save(superAdminUser);
        console.log("Seeded SuperAdmin user");
    }
}

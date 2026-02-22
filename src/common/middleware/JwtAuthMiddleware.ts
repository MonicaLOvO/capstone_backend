import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { injectable, inject } from "tsyringe";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.config";
import { RequestContext, RequestContextModel, type PermissionEntry } from "../context/RequestContext";
import { RolePermissionRepository } from "../../Permission/repository/RolePermissionRepository";
import type { RolePermission } from "../../Permission/entity/RolePermission";
import { JwtModel } from "../model/JwtModel";
import { UserRepository } from "../../user/repository/UserRepository";

/**
 * Paths that bypass JWT verification entirely (exact match).
 * Add new public routes here as needed.
 */
const AUTH_WHITELIST: string[] = [
    "/api/user/login",
    "/api/user/signup",
];



@Middleware({ type: "before" })
@injectable()
export class JwtAuthMiddleware implements ExpressMiddlewareInterface {
    constructor(
        @inject(RolePermissionRepository)
        private readonly rolePermissionRepo: RolePermissionRepository,
        @inject(UserRepository) 
        private readonly userRepo: UserRepository
    ) {}

    async use(request: any, response: any, next: (err?: any) => any): Promise<void> {
        if (AUTH_WHITELIST.includes(request.path)) {
            next();
            return;
        }

        const authHeader: string | undefined = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            response.status(401).json({ Success: false, Message: "Missing or invalid authorization header" });
            return;
        }

        const token = authHeader.split(" ")[1];

        let decoded: JwtModel;
        try {
            decoded = jwt.verify(token ?? "", JWT_SECRET) as JwtModel;
        } catch {
            response.status(401).json({ Success: false, Message: "Invalid or expired token" });
            return;
        }

        if (!decoded.userId || !decoded.username) {
            response.status(401).json({ Success: false, Message: "Invalid token" });
            return;
        }

        let permissions: PermissionEntry[] = [];
        if (decoded.roleId) {
            try {
                const user = await this.userRepo.GetUserById(decoded.userId);
                if(!user)
                {
                    response.status(401).json({ Success: false, Message: "User not found or changed" });
                    return;
                }
                if(user.Role?.Id != decoded.roleId)
                {
                    response.status(401).json({ Success: false, Message: "Role has changed, please re-login", Code: "TOKEN_STALE" });
                    return;
                }
               
            } catch {
                response.status(401).json({ Success: false, Message: "Role not found or changed" });
                return;
            }
            try {
                const rolePerms = await this.rolePermissionRepo.GetPermissionsByRoleId(decoded.roleId) as RolePermission[];
                permissions = rolePerms.map((rp) => ({
                    module: rp.Permission.Module,
                    action: rp.Permission.PermissionAction,
                }));
            } catch {
                permissions = [];
            }
        }

        const context: RequestContextModel = Object.assign<RequestContextModel, Partial<RequestContextModel>>(new RequestContextModel(), {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email ?? null,
            roleId: decoded.roleId ?? null,
            roleName: decoded.roleName ?? null,
            permissions: permissions ?? [],
        });

        RequestContext.run(context, () => next());
    }
}

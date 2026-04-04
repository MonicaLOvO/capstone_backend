import "reflect-metadata";
import { ForbiddenError } from "routing-controllers";
import { PermissionActionEnum } from "../../Permission/enum/PermissionActionEnum";
import { PermissionModuleEnum } from "../../Permission/enum/PermissionModuleEnum";
import { RequestContext } from "../context/RequestContext";

const AND_PERMISSION_KEY = Symbol("and_permissions");
const OR_PERMISSION_KEY = Symbol("or_permissions");
const PERMISSION_WRAPPED_KEY = Symbol("permission_wrapped");

interface PermissionRequirement {
    module: PermissionModuleEnum;
    action: PermissionActionEnum;
}

type RequestLike = {
    authContext?: {
        permissions?: Array<{ module: PermissionModuleEnum; action: PermissionActionEnum }>;
    };
    headers?: Record<string, unknown>;
    method?: string;
    path?: string;
};

function tryExtractRequestArg(args: any[]): RequestLike | null {
    for (const arg of args) {
        if (!arg || typeof arg !== "object") continue;
        const candidate = arg as RequestLike;
        if (candidate.authContext) return candidate;
        if (candidate.headers && candidate.method) return candidate;
    }
    return null;
}

function applyPermissionGuard(target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
    if (Reflect.getMetadata(PERMISSION_WRAPPED_KEY, target, propertyKey)) {
        return;
    }
    Reflect.defineMetadata(PERMISSION_WRAPPED_KEY, true, target, propertyKey);

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        const requestArg = tryExtractRequestArg(args);
        const context = RequestContext.current() ?? requestArg?.authContext;
        if (!context) {
            throw new ForbiddenError("No authentication context — access denied");
        }
        const permissions = context.permissions ?? [];

        const andPerms: PermissionRequirement[] =
            Reflect.getMetadata(AND_PERMISSION_KEY, target, propertyKey) ?? [];
        const orPerms: PermissionRequirement[] =
            Reflect.getMetadata(OR_PERMISSION_KEY, target, propertyKey) ?? [];

        for (const required of andPerms) {
            const found = permissions.some(
                (p) => p.module === required.module && p.action === required.action
            );
            if (!found) {
                throw new ForbiddenError(
                    `Missing required permission: ${required.module}:${required.action}`
                );
            }
        }

        if (orPerms.length > 0) {
            const hasAny = orPerms.some((required) =>
                permissions.some(
                    (p) => p.module === required.module && p.action === required.action
                )
            );
            if (!hasAny) {
                const labels = orPerms.map((r) => `${r.module}:${r.action}`).join(", ");
                throw new ForbiddenError(
                    `Requires at least one of: ${labels}`
                );
            }
        }

        return originalMethod.apply(this, args);
    };
}

/**
 * ALL @AndPermission entries on a method must be satisfied.
 *
 * @example
 * // User must have BOTH USER:READ and USER:UPDATE
 * @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.READ)
 * @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.UPDATE)
 */
export function AndPermission(
    module: PermissionModuleEnum,
    action: PermissionActionEnum
): MethodDecorator {
    return function (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const existing: PermissionRequirement[] =
            Reflect.getMetadata(AND_PERMISSION_KEY, target, propertyKey) ?? [];
        existing.push({ module, action });
        Reflect.defineMetadata(AND_PERMISSION_KEY, existing, target, propertyKey);

        applyPermissionGuard(target, propertyKey, descriptor);
    };
}

/**
 * At least ONE of the @ORPermission entries on a method must be satisfied.
 *
 * @example
 * // User must have USER:CREATE OR USER:UPDATE
 * @ORPermission(PermissionModuleEnum.USER, PermissionActionEnum.CREATE)
 * @ORPermission(PermissionModuleEnum.USER, PermissionActionEnum.UPDATE)
 */
export function OrPermission(
    module: PermissionModuleEnum,
    action: PermissionActionEnum
): MethodDecorator {
    return function (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const existing: PermissionRequirement[] =
            Reflect.getMetadata(OR_PERMISSION_KEY, target, propertyKey) ?? [];
        existing.push({ module, action });
        Reflect.defineMetadata(OR_PERMISSION_KEY, existing, target, propertyKey);

        applyPermissionGuard(target, propertyKey, descriptor);
    };
}

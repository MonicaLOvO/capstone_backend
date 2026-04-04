import { AsyncLocalStorage } from "async_hooks";
import { PermissionActionEnum } from "../../Permission/enum/PermissionActionEnum";
import { PermissionModuleEnum } from "../../Permission/enum/PermissionModuleEnum";

export interface PermissionEntry {
    module: PermissionModuleEnum;
    action: PermissionActionEnum;
}

export class RequestContextModel {
    userId!: string;
    username!: string;
    email?: string|null;
    roleId?: string|null;
    roleName?: string|null;
    permissions!: PermissionEntry[];
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContextModel>();

export class RequestContext {
    static run(context: RequestContextModel, fn: () => void): void {
        asyncLocalStorage.run(context, fn);
    }

    static current(): RequestContextModel | undefined {
        return asyncLocalStorage.getStore();
    }

    static currentOrFail(): RequestContextModel {
        const ctx = asyncLocalStorage.getStore();
        if (!ctx) {
            throw new Error("No request context available — is the request authenticated?");
        }
        return ctx;
    }
}

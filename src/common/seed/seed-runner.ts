import { DataSource } from "typeorm";
import { seedPermissions } from "./permission.seed";
import { seedRoles } from "./role.seed";

export async function runSeeds(dataSource: DataSource): Promise<void> {
    console.log("Running seed scripts...");

    try {
        await seedPermissions(dataSource);
        await seedRoles(dataSource);
        console.log("Seed scripts completed successfully");
    } catch (error) {
        console.error("Error running seed scripts:", error);
        throw error;
    }
}

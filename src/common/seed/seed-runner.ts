import { DataSource } from "typeorm";
import { seedPermissions } from "./permission.seed";

export async function runSeeds(dataSource: DataSource): Promise<void> {
    console.log("Running seed scripts...");

    try {
        await seedPermissions(dataSource);
        console.log("Seed scripts completed successfully");
    } catch (error) {
        console.error("Error running seed scripts:", error);
        throw error;
    }
}

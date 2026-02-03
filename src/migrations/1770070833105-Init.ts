import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1770070833105 implements MigrationInterface {
    name = 'Init1770070833105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`Active\` tinyint NOT NULL DEFAULT 0, \`EmailVerified\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`inventory_items\` (\`CreatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`UpdatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`CreatedBy\` varchar(36) NULL, \`UpdatedBy\` varchar(36) NULL, \`DeletedAt\` datetime NULL, \`Id\` uuid NOT NULL, \`ItemName\` varchar(255) NOT NULL, \`Description\` varchar(255) NOT NULL, \`Quantity\` int NOT NULL DEFAULT '0', \`UnitPrice\` decimal(10,2) NOT NULL, \`QrCode\` varchar(255) NULL, \`ImageUrl\` varchar(255) NULL, \`Category\` varchar(255) NULL, \`Location\` varchar(255) NULL, \`Sku\` varchar(255) NOT NULL, \`Status\` enum ('0', '1', '2', '3', '4', '5', '6', '7') NOT NULL, UNIQUE INDEX \`IDX_47a725e0b4e8f1fb0b2e777542\` (\`Sku\`), PRIMARY KEY (\`Id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_47a725e0b4e8f1fb0b2e777542\` ON \`inventory_items\``);
        await queryRunner.query(`DROP TABLE \`inventory_items\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}

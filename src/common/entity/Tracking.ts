import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Tracking {
    @PrimaryGeneratedColumn("uuid")
    Id!: string;
    
    @CreateDateColumn()
    CreatedAt!: Date;

    @UpdateDateColumn()
    UpdatedAt!: Date;

    @Column({ type: "varchar", length: 36, nullable: true })
    CreatedBy?: string;

    @Column({ type: "varchar", length: 36, nullable: true })
    UpdatedBy?: string;

    @Column({ type: "datetime", nullable: true })
    DeletedAt?: Date;
}
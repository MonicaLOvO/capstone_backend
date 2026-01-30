import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class Tracking {
    @CreateDateColumn()
    CreatedAt!: Date;

    @UpdateDateColumn()
    UpdatedAt!: Date;

    @Column({ type: "varchar", length: 36 })
    CreatedBy!: string;

    @Column({ type: "varchar", length: 36 })
    UpdatedBy!: string;

    @Column({ type: "datetime", nullable: true })
    DeletedAt?: Date;
}
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  Id!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  FireBaseUserId!: string;

  @Column({ type: "varchar", length: 255 })
  Name!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  Email!: string;

  @Column({ type: "datetime", nullable: true })
  DeletedAt?: Date | null;
}


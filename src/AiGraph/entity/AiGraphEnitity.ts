import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { Tracking } from "../../common/entity/Tracking";

@Entity("AI_graph")
export class EmployeeReport extends Tracking {
    @PrimaryGeneratedColumn("uuid")
    Id!: string;

    @Column({ type: "varchar", length: 255 })
    Ai_Id!: string;

    @Column({  type: "varchar", length: 255 })
    toDo!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    reason!: string;

}


import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";




@Entity("user")
export class User {
    @PrimaryGeneratedColumn({ name: "user_id" })
    id: number

    @Column({name: "username", nullable: false, unique: true})
    username: string

    @Column({name: "email", nullable: false, unique: true})
    email: string

    @Column({nullable: false})
    @Exclude()
    password: string
}
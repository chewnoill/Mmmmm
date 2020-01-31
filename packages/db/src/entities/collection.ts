import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "./user";

@Entity()
export class Collection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(
    type => User,
    user => user.collections
  )
  users: User[];
}

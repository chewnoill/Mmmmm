import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Collection } from "./collection";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(
    type => Collection,
    collection => collection.users
  )
  @JoinTable()
  collections: Collection[];
}

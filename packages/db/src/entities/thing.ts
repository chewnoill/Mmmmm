import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable } from "typeorm";
import { Collection } from "./collection";

@Entity()
export class Thing {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    type => Collection,
    collection => collection.things
  )
  collection: Collection;
}

import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Collection } from "./collection";

@Entity()
export class Thing {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  value: string;

  @ManyToOne(
    type => Collection,
    collection => collection.things
  )
  collection: Collection;
}

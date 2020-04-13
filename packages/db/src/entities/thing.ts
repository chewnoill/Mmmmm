import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Collection } from "./collection";

export enum ThingType {
  IMAGE_LINK,
  TEXT
}

@Entity()
export class Thing {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: ThingType,
    default: ThingType.TEXT
  })
  type: ThingType;

  @Column()
  value: string;

  @ManyToOne(
    type => Collection,
    collection => collection.things
  )
  collection: Collection;
}

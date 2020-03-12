import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Column,
  Index,
  BaseEntity
} from "typeorm";
import { Collection } from "./collection";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column({ nullable: true })
  refresh_token: string;

  @ManyToMany(
    type => Collection,
    collection => collection.users
  )
  @JoinTable()
  collections: Collection[];

  setRefreshToken(token: string) {
    this.refresh_token = token;
    return this.save();
  }
}

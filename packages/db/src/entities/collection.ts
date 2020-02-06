import { User } from "./user";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable
} from "typeorm";
import { Thing } from "./thing";

@Entity()
export class Collection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(
    type => User,
    user => user.collections
  )
  users: User[];

  @OneToMany(
    type => Thing,
    thing => thing.collection
  )
  things: Thing[];
}

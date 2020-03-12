import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  Column
} from "typeorm";
import { User } from "./user";
import { Thing } from "./thing";

@Entity()
export class Collection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

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

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  Column,
  Index,
  BaseEntity
} from "typeorm";
import { Collection } from "./collection";
import { Injectable, ProviderScope } from "@graphql-modules/di";
import * as DataLoader from "dataloader";
import { getConnection, Connection } from "../typeorm";
import { mapIds } from "../utils";

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

@Injectable({ scope: ProviderScope.Session })
export class UserProvider {
  connection: Connection;
  userLoader: DataLoader<string, User>;
  userCollectionLoader: DataLoader<string, Collection[]>;
  constructor() {
    this.connection = getConnection();
    this.userLoader = new DataLoader(ids =>
      this.connection.manager
        .createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("user.id IN (:...ids)", { ids })
        .getMany()
        .then(mapIds(ids))
    );
    this.userCollectionLoader = new DataLoader(ids =>
      this.connection.manager
        .createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("user.id IN (:...ids)", { ids })
        .leftJoinAndSelect("user.collections", "collection")
        .getMany()
        .then(mapIds(ids))
        .then(users => users.map(user => user.collections))
    );
  }

  getUser(id: string) {
    return this.userLoader.load(id);
  }

  getUserByEmail(email: string) {
    return this.connection.manager
      .createQueryBuilder()
      .select("user")
      .from(User, "user")
      .where("user.email = :email", { email })
      .getOne();
  }

  createUser() {
    const user = new User();
    return this.connection.manager.save(user);
  }

  getCollections(id: string) {
    return this.userCollectionLoader.load(id);
  }
}

import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Collection } from "./collection";
import { Injectable, ProviderScope } from "@graphql-modules/di";
import * as DataLoader from "dataloader";
import { getConnection, Connection } from "../typeorm";
import { mapIds } from "../utils";

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

@Injectable({ scope: ProviderScope.Session })
export class UserProvider {
  connection: Connection;
  collectionLoader: DataLoader<string, User>;
  constructor() {
    this.connection = getConnection();
    this.collectionLoader = new DataLoader(ids =>
      this.connection.manager
        .createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("user.id IN (:...ids)", { ids })
        .leftJoinAndSelect("user.collections", "collection")
        .getMany()
        .then(mapIds(ids))
    );
  }

  getCollection(id: string) {
    return this.collectionLoader.load(id);
  }

  getCollections() {
    return this.connection.manager
      .createQueryBuilder()
      .select("collection")
      .from(Collection, "collection")
      .getMany();
  }

  createCollection() {
    const collection = new Collection();
    return this.connection.manager.save(collection);
  }
}

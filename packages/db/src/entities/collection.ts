import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "./user";
import { Injectable, ProviderScope } from "@graphql-modules/di";
import * as DataLoader from "dataloader";
import { getConnection, Connection } from "../typeorm";
import { mapIds } from "../utils";

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

@Injectable({ scope: ProviderScope.Session })
export class CollectionProvider {
  connection: Connection;
  collectionLoader: DataLoader<string, Collection>;
  constructor() {
    this.connection = getConnection();
    this.collectionLoader = new DataLoader(ids =>
      this.connection.manager
        .createQueryBuilder()
        .select("collection")
        .from(Collection, "collection")
        .where("collection.id IN (:...ids)", { ids })
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

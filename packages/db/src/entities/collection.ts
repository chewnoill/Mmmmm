import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable
} from "typeorm";
import { User, UserProvider } from "./user";
import { Thing } from "./thing";
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

  @OneToMany(
    type => Thing,
    thing => thing.collection
  )
  things: Thing[];
}

@Injectable({ scope: ProviderScope.Session })
export class CollectionProvider {
  connection: Connection;
  collectionLoader: DataLoader<string, Collection>;
  collectionThingLoader: DataLoader<string, Thing[]>;
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
    this.collectionThingLoader = new DataLoader(ids =>
      this.connection.manager
        .createQueryBuilder()
        .select("collection")
        .from(Collection, "collection")
        .where("collection.id IN (:...ids)", { ids })
        .leftJoinAndSelect("collection.things", "thing")
        .getMany()
        .then(mapIds(ids))
        .then(collections => collections.map(collection => collection.things))
    );
  }

  getCollection(id: string) {
    return this.collectionLoader.load(id);
  }

  getCollections(ids: string[]) {
    return this.collectionLoader.loadMany(ids);
  }
  getThings(id: string) {
    return this.collectionThingLoader.load(id);
  }

  async createCollection(user: User) {
    const collection = new Collection();
    collection.users = [user];
    return this.connection.manager.save(collection);
  }
}

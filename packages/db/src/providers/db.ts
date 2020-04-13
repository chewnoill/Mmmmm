import { User } from "../entities/user";
import { Thing, ThingType } from "../entities/thing";
import { Collection } from "../entities/collection";
import { Injectable, ProviderScope } from "@graphql-modules/di";
import * as DataLoader from "dataloader";
import { getConnection, Connection } from "../typeorm";
import { mapIds } from "../utils";

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

  getUserCollection(userId: string, collectionId: string) {
    return this.connection.manager
      .createQueryBuilder()
      .select("collection")
      .from(Collection, "collection")
      .where("collection.id = :collectionId", { collectionId })
      .andWhere("user.id = :userId", { userId })
      .leftJoin("collection.users", "user")
      .getOne();
  }
  getUserCollectionThing(
    userId: string,
    collectionId: string,
    thingId: string
  ) {
    return this.connection.manager
      .createQueryBuilder()
      .select("thing")
      .from(Thing, "thing")
      .where("thing.id = :thingId", { thingId })
      .andWhere("user.id = :userId", { userId })
      .andWhere("collection.id = :collectionId", { collectionId })
      .leftJoin("thing.collection", "collection")
      .leftJoin("collection.users", "user")
      .getOne();
  }
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

  async createCollection(user: User, name: string) {
    const collection = new Collection();
    collection.name = name;
    collection.users = [user];
    return this.connection.manager.save(collection);
  }
}

@Injectable({ scope: ProviderScope.Session })
export class ThingProvider {
  connection: Connection;
  thingLoader: DataLoader<string, Thing>;
  constructor() {
    this.connection = getConnection();
    this.thingLoader = new DataLoader(ids =>
      this.connection.manager
        .createQueryBuilder()
        .select("thing")
        .from(Thing, "thing")
        .where("thing.id IN (:...ids)", { ids })
        .getMany()
        .then(mapIds(ids))
    );
  }

  getThing(id: string) {
    return this.thingLoader.load(id);
  }

  getThings(ids: string[]) {
    return this.thingLoader.loadMany(ids);
  }

  createThing(collection: Collection, value: string, type: ThingType) {
    const thing = new Thing();
    thing.collection = collection;
    thing.type = type;
    thing.value = value;
    return this.connection.manager.save(thing);
  }

  async updateThing(id: string, value: string) {
    const thing = await this.getThing(id);
    if (!thing) throw Error("not found");
    thing.value = value;
    return this.connection.manager.save(thing);
  }
}

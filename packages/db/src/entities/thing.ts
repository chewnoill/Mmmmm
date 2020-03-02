import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  Column
} from "typeorm";
import { Collection, CollectionProvider } from "./collection";
import { Injectable, ProviderScope } from "@graphql-modules/di";
import * as DataLoader from "dataloader";
import { getConnection, Connection } from "../typeorm";
import { mapIds } from "../utils";

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

  createThing(collection: Collection, value: string) {
    const thing = new Thing();
    thing.collection = collection;
    thing.value = value;
    return this.connection.manager.save(thing);
  }
}

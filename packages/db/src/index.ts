import { GraphQLModule, ModuleContext } from "@graphql-modules/core";
import gql from "graphql-tag";
import { UserProvider } from "./entities/user";
import { CollectionProvider } from "./entities/collection";
import { ThingProvider } from "./entities/thing";
import { setupConnection } from "./typeorm";
import { PaginationModule } from "./paginator";

export * from "./entities/collection";
export * from "./entities/thing";
export * from "./entities/user";

const DatabaseModule = new GraphQLModule<
  { DB_URL?: string },
  any,
  ModuleContext
>({
  imports: ({ config }) => {
    if (!config || !config.DB_URL) return [PaginationModule];
    setupConnection({
      url: config.DB_URL
    });

    return [PaginationModule];
  },
  typeDefs: [
    gql`
      type User {
        id: ID!
        email: String!
      }
      type Collection {
        id: ID!
        name: String!
      }
      type Thing {
        id: ID!
        value: String!
      }
    `
  ],
  resolvers: {
    User: {
      email: ({ id }, _, { injector }) =>
        injector
          .get(UserProvider)
          .getUser(id)
          .then(c => c.email)
    },
    Collection: {
      name: ({ id }, _, { injector }) =>
        injector
          .get(CollectionProvider)
          .getCollection(id)
          .then(c => c.name)
    },
    Thing: {
      value: ({ id }, _, { injector }) =>
        injector
          .get(ThingProvider)
          .getThing(id)
          .then(c => c.value)
    }
  },
  providers: [UserProvider, CollectionProvider, ThingProvider]
});

export default DatabaseModule;

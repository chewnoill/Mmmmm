import { GraphQLModule, ModuleContext } from "@graphql-modules/core";
import gql from "graphql-tag";
import { UserProvider } from "./entities/user";
import { CollectionProvider } from "./entities/collection";
import { ThingProvider } from "./entities/thing";
import { setupConnection } from "./typeorm";

export * from "./entities/collection";
export * from "./entities/thing";
export * from "./entities/user";

const DatabaseModule = new GraphQLModule<
  { DB_URL?: string },
  any,
  ModuleContext
>({
  imports: ({ config }) => {
    if (!config || !config.DB_URL) return [];
    setupConnection({
      url: config.DB_URL
    });

    return [];
  },
  typeDefs: [
    gql`
      type User {
        id: ID!
        email: String!
        collections: [Collection!]!
      }
      type Collection {
        id: ID!
        name: String!
        things: [Thing!]!
      }
      type Thing {
        id: ID!
        value: String!
      }
    `
  ],
  resolvers: {
    User: {
      collections: ({ id }, _, { injector }) =>
        injector.get(UserProvider).getCollections(id)
    },
    Collection: {
      things: ({ id }, _, { injector }) =>
        injector.get(CollectionProvider).getThings(id)
    }
  },
  providers: [UserProvider, CollectionProvider, ThingProvider]
});

export default DatabaseModule;

import { GraphQLModule, ModuleContext } from "@graphql-modules/core";
import gql from "graphql-tag";
import { UserProvider, CollectionProvider, ThingProvider } from "./providers";
import { setupConnection } from "./typeorm";
import { PaginationModule } from "./paginator";
import { ThingType } from "./entities/thing";

export * from "./entities/user";
export * from "./entities/collection";
export * from "./entities/thing";
export * from "./providers";

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
      interface Thing {
        id: ID!
      }
      type TextThing implements Thing {
        id: ID!
        value: String!
      }
      type ImageThing implements Thing {
        id: ID!
      }
    `
  ],
  resolvers: {
    User: {
      email: ({ id }, _, { injector }) =>
        injector
          .get(UserProvider)
          .getUser(id)
          .then(c => c && c.email)
    },
    Collection: {
      name: ({ id }, _, { injector }) =>
        injector
          .get(CollectionProvider)
          .getCollection(id)
          .then(c => c && c.name)
    },
    Thing: {
      __resolveType: async (
        { id }: { id: string },
        { injector }: { injector: any }
      ) => {
        const thing = await injector.get(ThingProvider).getThing(id);
        switch (thing.type) {
          case ThingType.IMAGE_LINK:
            return "ImageThing";
          case ThingType.TEXT:
          default:
            return "TextThing";
        }
      }
    },
    TextThing: {
      value: ({ id }, _, { injector }) =>
        injector
          .get(ThingProvider)
          .getThing(id)
          .then(c => c && c.value)
    }
  },
  providers: [UserProvider, CollectionProvider, ThingProvider]
});

export default DatabaseModule;

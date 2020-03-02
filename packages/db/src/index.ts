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
      type Mutation {
        users: UserMutations!
        collections: CollectionMutations!
        things: ThingMutations!
      }
      type Query {
        users: UserQueries!
      }
      type UserQueries {
        user(id: ID!): User
      }
      type UserMutations {
        create: User
      }
      input CreateCollectionsInput {
        userId: ID!
        name: String!
      }
      type CollectionMutations {
        create(input: CreateCollectionsInput!): Collection
      }
      type ThingMutations {
        create(collectionId: ID!): Thing
      }
    `
  ],
  resolvers: {
    Query: {
      users: () => ({})
    },
    UserQueries: {
      user: (_, { id }, { injector }) => injector.get(UserProvider).getUser(id)
    },
    User: {
      collections: ({ id }, _, { injector }) =>
        injector.get(UserProvider).getCollections(id)
    },
    Collection: {
      things: ({ id }, _, { injector }) =>
        injector.get(CollectionProvider).getThings(id)
    },
    Mutation: {
      users: () => ({}),
      collections: () => ({}),
      things: () => ({})
    },
    UserMutations: {
      create: async (_, __, { injector }) =>
        injector.get(UserProvider).createUser()
    },
    CollectionMutations: {
      create: async (_, { userId, name }, { injector }) =>
        injector
          .get(CollectionProvider)
          .createCollection(
            await injector.get(UserProvider).getUser(userId),
            name
          )
    },
    ThingMutations: {
      create: async (_, { collectionId }, { injector }) =>
        injector
          .get(ThingProvider)
          .createThing(
            await injector.get(CollectionProvider).getCollection(collectionId)
          )
    }
  },
  providers: [UserProvider, CollectionProvider, ThingProvider]
});

export default DatabaseModule;

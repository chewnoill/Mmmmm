import { GraphQLModule } from "@graphql-modules/core";
import gql from "graphql-tag";
import resolvers from "./resolvers";
import DatabaseModule, {
  UserProvider,
  Collection,
  CollectionProvider,
  Thing,
  ThingProvider
} from "db";
import AuthModule, { GoogleProvider } from "auth-module";
import AWSModule, { AWSProvider } from "aws-module";

const Module = new GraphQLModule({
  imports: [DatabaseModule, AuthModule, AWSModule],
  typeDefs: gql`
    type Query {
      me: Me! @auth
    }

    type Me {
      collection(id: ID!): Collection
    }

    type Thing {
      s3url: String
    }

    type Mutation {
      me: MeMutations
    }

    input CreateCollectionInput {
      name: String!
    }

    type MeMutations {
      createCollection(input: CreateCollectionInput): Collection
      collection(id: ID!): UpdateCollection
    }

    type UpdateCollection {
      createThing(name: String!): CreateThingResponse
    }

    type CreateThingResponse {
      thing: Thing!
      createPresignedPost: AWSPresignedURL!
    }
  `,
  resolvers: {
    Query: {
      me: () => ({})
    },
    Mutation: {
      me: () => ({})
    },
    Me: {
      collection: (_, { id }, { injector }) =>
        injector.get(CollectionProvider).getCollection(id)
    },
    Thing: {
      s3url: (thing: Thing, _, { injector }) =>
        injector.get(AWSProvider).getPresignedGet(`${thing.id}:${thing.value}`)
    },
    MeMutations: {
      createCollection: async (_, { input: { name } }, { injector }) =>
        injector
          .get(CollectionProvider)
          .createCollection(
            injector.get(GoogleProvider).authorizeSession(),
            name
          ),
      collection: (_, { id }, { injector }) =>
        injector.get(CollectionProvider).getCollection(id)
    },
    UpdateCollection: {
      createThing: (collection: Collection, { name }, { injector }) =>
        injector.get(ThingProvider).createThing(collection, name)
    },
    CreateThingResponse: {
      thing: (thing: Thing) => thing,
      createPresignedPost: (thing: Thing, _, { injector }) =>
        injector.get(AWSProvider).getPresignedPost(`${thing.id}:${thing.value}`)
    },
    ...resolvers
  }
});

export default Module;

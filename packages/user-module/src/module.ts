import { GraphQLModule, ModuleContext } from "@graphql-modules/core";
import gql from "graphql-tag";
import resolvers from "./resolvers";
import DatabaseModule, {
  UserProvider,
  Collection,
  CollectionProvider,
  Thing,
  ThingProvider,
  ThingType,
  User
} from "db";
import AuthModule from "auth-module";
import AWSModule, { AWSProvider } from "aws-module";

const Module = new GraphQLModule<
  {},
  { req: any },
  ModuleContext<{ user: User }>
>({
  imports: [DatabaseModule, AuthModule, AWSModule],
  typeDefs: gql`
    type Query {
      me: Me! @auth
    }

    type ImageThing {
      s3url: String!
      mimeType: String!
    }

    type Me {
      collection(id: ID!): Collection
      thing(id: ID!): Thing
    }

    type Mutation {
      me: MeMutations @auth
    }

    input CreateCollectionInput {
      name: String!
    }

    type MeMutations {
      createCollection(input: CreateCollectionInput): Collection
      collection(id: ID!): UpdateCollectionMutations
    }

    type UpdateCollectionMutations {
      uploadFile(mimeType: String!): UploadFileResponse!
      createThing(value: String!): Thing!
      updateThing(args: UpdateTextThingInput): Thing!
      update(args: UpdateCollectionInput): Collection!
    }

    type UploadFileResponse {
      presignedPost: AWSPresignedURL!
      id: ID!
    }

    input UpdateCollectionInput {
      name: String!
    }

    input UpdateTextThingInput {
      id: ID!
      value: String!
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
      collection: (_, { id }, { injector, user }) =>
        injector.get(UserProvider).getUserCollection(user.id, id),
      thing: (_, { id }, { injector, user }) =>
        injector.get(UserProvider).getUserCollectionThing(user.id, id)
    },
    ImageThing: {
      s3url: (thing: Thing, _, { injector }) =>
        injector.get(AWSProvider).getPresignedGet(thing.id),
      mimeType: (thing: Thing, _, { injector }) => thing.value
    },
    MeMutations: {
      createCollection: async (_, { input: { name } }, { injector, user }) =>
        injector.get(CollectionProvider).createCollection(user, name),
      collection: (_, { id }, { injector }) =>
        injector.get(CollectionProvider).getCollection(id)
    },
    UpdateCollectionMutations: {
      uploadFile: async (
        collection: Collection,
        { mimeType },
        { injector }
      ) => {
        const thing = await injector
          .get(ThingProvider)
          .createThing(collection, mimeType, ThingType.IMAGE_LINK);
        return {
          id: thing.id,
          presignedPost: injector.get(AWSProvider).getPresignedPost(thing.id)
        };
      },
      createThing: (collection: Collection, { value }, { injector }) =>
        injector
          .get(ThingProvider)
          .createThing(collection, value, ThingType.TEXT),
      updateThing: (_, { args }, { injector }) =>
        injector.get(ThingProvider).updateThing(args.id, args.value),
      update: (collection: Collection, { args }, { injector }) =>
        injector.get(CollectionProvider).updateCollection(collection, args)
    },
    ...resolvers
  },
  providers: []
});

export default Module;

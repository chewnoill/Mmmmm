import { GraphQLModule } from "@graphql-modules/core";
import gql from "graphql-tag";
import { PaginationProvider } from "./providers";

export const PaginationModule = new GraphQLModule({
  imports: [],
  typeDefs: [
    gql`
      scalar Cursor

      type PageInfo {
        hasPreviousPage: Boolean!
        hasNextPage: Boolean!
      }

      input PageArgs {
        first: Int
        after: Cursor
      }

      type User {
        collections(args: PageArgs): CollectionConnection!
      }

      type Collection {
        things(args: PageArgs): ThingConnection!
      }

      type CollectionConnection {
        edges: [CollectionEdge!]!
        pageInfo: PageInfo!
      }

      type CollectionEdge {
        edge: Collection!
        cursor: Cursor!
      }

      type ThingConnection {
        edges: [ThingEdge!]!
        pageInfo: PageInfo!
      }

      type ThingEdge {
        edge: Thing!
        cursor: Cursor!
      }
    `
  ],
  resolvers: {
    User: {
      collections: ({ id }, { args }, { injector }) =>
        injector.get(PaginationProvider).paginateUserCollections(id, args)
    },
    Collection: {
      things: ({ id }, { args }, { injector }) =>
        injector.get(PaginationProvider).paginateCollectionTextThings(id, args)
    }
  },
  providers: [PaginationProvider]
});

export default PaginationModule;

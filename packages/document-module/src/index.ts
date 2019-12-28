import { GraphQLModule } from "@graphql-modules/core";
import gql from "graphql-tag";
import resolvers from "./resolvers";
import AutoMergeProvider from "./providers";

const DocumentModule = new GraphQLModule({
  typeDefs: gql`
    # ----------------------------------------
    # root query types

    type Query {
      document: DocumentsQuery
    }

    type Mutation {
      documents: DocumentsMutation
    }

    # ----------------------------------------
    # document scalars

    scalar AutoMergeState
    scalar AutoMergeChange

    # ----------------------------------------
    # document queries

    type DocumentsQuery {
      document(id: ID!): Document
    }

    type Document {
      id: ID!
      contents: AutoMergeState!
    }

    # ----------------------------------------
    # document mutatons

    type DocumentsMutation {
      update(input: DocumentUpdate!): Boolean!
    }

    input DocumentUpdate {
      id: ID!
      change: AutoMergeChange!
    }

    # ----------------------------------------
    # document subscription

    type Subscription {
      document(id: ID!): AutoMergeChange
    }
  `,
  resolvers: {
    Query: {
      document: () => ({})
    },
    Mutation: {
      documents: () => ({})
    },
    ...resolvers
  },
  providers: [AutoMergeProvider]
});

export default DocumentModule;

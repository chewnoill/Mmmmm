import { GraphQLModule } from "@graphql-modules/core";
import gql from "graphql-tag";
import DocumentModule from "document-module";

export const App = new GraphQLModule({
  imports: [DocumentModule],
  typeDefs: gql`
    type Query {
      status: String
      user: UserQuery
      document: DocumentsQuery
    }

    type UserQuery {
      me: User
    }

    type User {
      id: ID!
      email: String!
      name: String!
      documents: [Document]
    }

    type Document {
      id: ID!
      contents: String!
      history: [DocumentHistory]!
    }

    type DocumentHistory {
      item: [HistoryItem]
    }

    type HistoryItem {
      stuff: String
    }

    type DocumentsQuery {
      document: Document
    }

    type Mutation {
      documents: DocumentsMutation
    }

    type DocumentsMutation {
      update(history: HistoryInput): String
    }

    input HistoryInput {
      change: [String]
    }
  `,
  resolvers: {
    Query: {
      status: () => "hello world"
    }
  }
});

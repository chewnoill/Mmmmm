import { GraphQLModule } from "@graphql-modules/core";
import gql from "graphql-tag";
import DocumentModule from "document-module";

export const App = new GraphQLModule({
  imports: [DocumentModule],
  typeDefs: gql`
    type Query {
      status: String
    }
  `,
  resolvers: {
    Query: {
      status: () => "hello world"
    }
  }
});

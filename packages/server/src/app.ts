import { GraphQLModule } from "@graphql-modules/core";
import gql from "graphql-tag";

export const App = new GraphQLModule({
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

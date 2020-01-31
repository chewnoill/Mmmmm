import { GraphQLModule } from "@graphql-modules/core";
import gql from "graphql-tag";
import DocumentModule from "document-module";
import DatabaseModule from "db";
import { DATABASE_URL } from "./env";

export const App = new GraphQLModule({
  imports: [DocumentModule, DatabaseModule.forRoot({ DB_URL: DATABASE_URL })],
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

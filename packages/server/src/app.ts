import { GraphQLModule } from "@graphql-modules/core";
import gql from "graphql-tag";
import DocumentModule from "document-module";
import DatabaseModule from "db";
import AuthModule from "auth-module";
import {
  DATABASE_URL,
  GOOGLE_AUTH_ID,
  GOOGLE_AUTH_SECRET,
  GOOGLE_AUTH_CALLBACK
} from "./env";

export const App = new GraphQLModule({
  imports: [
    DocumentModule,
    DatabaseModule.forRoot({ DB_URL: DATABASE_URL }),
    AuthModule.forRoot({
      googleAuthId: GOOGLE_AUTH_ID,
      googleAuthSecret: GOOGLE_AUTH_SECRET,
      googleAuthCallback: GOOGLE_AUTH_CALLBACK
    })
  ],
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

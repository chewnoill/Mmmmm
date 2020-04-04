import { GraphQLModule } from "@graphql-modules/core";
import gql from "graphql-tag";
import DocumentModule from "document-module";
import DatabaseModule from "db";
import AuthModule from "auth-module";
import AWSModule from "aws-module";
import UserModule from "user-module";

interface Config {
  DATABASE_URL: string;
  AWS_USER: string;
  AWS_PASSWORD: string;
  AWS_S3_BUCKET: string;
  GOOGLE_AUTH_ID: string;
  GOOGLE_AUTH_SECRET: string;
  GOOGLE_AUTH_CALLBACK: string;
}

export const App = new GraphQLModule<Config>({
  imports: ({
    config: {
      DATABASE_URL,
      AWS_USER,
      AWS_PASSWORD,
      AWS_S3_BUCKET,
      GOOGLE_AUTH_ID,
      GOOGLE_AUTH_SECRET,
      GOOGLE_AUTH_CALLBACK
    }
  }) => [
    DocumentModule,
    DatabaseModule.forRoot({ DB_URL: DATABASE_URL }),
    AWSModule.forRoot({
      accessKeyId: AWS_USER,
      secretAccessKey: AWS_PASSWORD,
      bucketName: AWS_S3_BUCKET
    }),
    AuthModule.forRoot({
      googleAuthId: GOOGLE_AUTH_ID,
      googleAuthSecret: GOOGLE_AUTH_SECRET,
      googleAuthCallback: GOOGLE_AUTH_CALLBACK
    }),
    UserModule
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

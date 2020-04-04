import "reflect-metadata";
import {
  CLIENT_BASE_URL,
  SERVER_PORT,
  SERVER_GRAPHQL_ENDPOINT,
  SERVER_BASE_URL,
  DATABASE_URL,
  AWS_USER,
  AWS_PASSWORD,
  AWS_S3_BUCKET,
  GOOGLE_AUTH_ID,
  GOOGLE_AUTH_SECRET,
  GOOGLE_AUTH_CALLBACK
} from "./env";

import * as Hapi from "@hapi/hapi";
import { makeExecutableSchema } from "graphql-tools";
import { ApolloServer } from "apollo-server-hapi";
import { App } from "app";

async function StartServer() {
  const app = new Hapi.Server({
    port: SERVER_PORT,
    uri: SERVER_BASE_URL
  });

  const { typeDefs, resolvers, schemaDirectives, context } = App.forRoot({
    DATABASE_URL,
    AWS_USER,
    AWS_PASSWORD,
    AWS_S3_BUCKET,
    GOOGLE_AUTH_ID,
    GOOGLE_AUTH_SECRET,
    GOOGLE_AUTH_CALLBACK
  });
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives,
    allowUndefinedInResolve: false
  });

  const server = new ApolloServer({
    schema,
    playground: true,
    context: ({ request, h, ...rest }) =>
      context({
        session: {
          req: request,
          resp: h
        },
        ...rest
      })
  });

  await server.applyMiddleware({
    app: app as any,
    path: `/${SERVER_GRAPHQL_ENDPOINT}`,
    cors: {
      origin: [CLIENT_BASE_URL],
      credentials: true
    }
  });

  await server.installSubscriptionHandlers(app.listener);

  app.start().then(() => {
    console.log(`🚀 Server ready ${app.info.uri}/${SERVER_GRAPHQL_ENDPOINT}`);
  });
}

StartServer().catch(error => {
  console.error(error);
});

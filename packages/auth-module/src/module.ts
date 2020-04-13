import { GraphQLModule, ModuleContext } from "@graphql-modules/core";
import DatabaseModule from "db";
import gql from "graphql-tag";
import { GoogleProvider } from "./providers";
import { Config, Context } from "./types";
import { AuthenticatedDirective } from "./directive";

export interface Session {
  req: any; //Hapi.Request
}

const AuthModule = new GraphQLModule<Config, Session, ModuleContext<Context>>({
  imports: [DatabaseModule],
  typeDefs: gql`
    directive @auth on FIELD_DEFINITION

    type Query {
      auth: AuthQuery!
    }

    type AuthQuery {
      login_url: String!
      me: Me @auth
    }

    type Me {
      user: User
    }

    type Mutation {
      auth: AuthMutation
    }

    type AuthMutation {
      login(code: String!): LoginResponse
    }

    type LoginResponse {
      authToken: String!
    }
  `,
  resolvers: {
    Query: {
      auth: () => ({})
    },
    Mutation: {
      auth: () => ({})
    },
    AuthQuery: {
      login_url: (_, __, { injector }) =>
        injector.get(GoogleProvider).getAuthURL(),
      me: (_, __, { injector }) => ({
        user: injector.get(GoogleProvider).getUser()
      })
    },
    Me: {
      user: (_, __, { injector }) =>
        injector.get(GoogleProvider).authorizeSession()
    },
    AuthMutation: {
      login: (_, { code }, { injector }) =>
        injector.get(GoogleProvider).authorize(code)
    }
  },
  schemaDirectives: { auth: AuthenticatedDirective },
  providers: [GoogleProvider],
  context: async ({ req }, _, { injector }) => {
    const auth = req.headers.authorization || req.headers.Authorization;
    const user = await injector.get(GoogleProvider).getFromAuth(auth);
    return { user, injector };
  }
});

export default AuthModule;

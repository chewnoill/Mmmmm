import { Resolvers } from "./generated/graphql";
import { GoogleProvider } from "./providers";

const resolvers: Resolvers = {
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
};

export default resolvers;

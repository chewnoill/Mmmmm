import { Resolvers } from "./generated/graphql";
import { AutoMergeState, AutoMergeChange } from "./automerge";
import AutoMergeProvider from "./providers";

const resolvers: Resolvers = {
  // ---------------------------------------------
  // Scalars
  AutoMergeState,
  AutoMergeChange,

  // ---------------------------------------------
  // Queries
  DocumentsQuery: {
    document: (_, { id }, { injector }) => ({
      id,
      contents: injector.get(AutoMergeProvider).getContents(id)
    })
  },
  // ---------------------------------------------
  // Mutations
  DocumentsMutation: {
    update: (_, { input }, { injector }) =>
      injector.get(AutoMergeProvider).applyChange(input)
  },

  // ---------------------------------------------
  // Subscription
  Subscription: {
    document: {
      subscribe: (_, { id }, { injector }) =>
        injector.get(AutoMergeProvider).subscribe(id),
      resolve: (payload: string) => payload
    }
  }
};

export default resolvers;

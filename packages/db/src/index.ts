import { GraphQLModule } from "@graphql-modules/core";
import gql from "graphql-tag";

const DatabaseModule = new GraphQLModule({
  typeDefs: gql``,
  resolvers: {},
  providers: []
});

export default DatabaseModule;

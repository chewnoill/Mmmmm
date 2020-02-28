import { GraphQLModule } from "@graphql-modules/core";
import gql from "graphql-tag";
import resolvers from "./resolvers";

const Module = new GraphQLModule({
  imports: [],
  typeDefs: gql``,
  resolvers
});

export default Module;

import { GraphQLModule } from "@graphql-modules/core";
import gql from "graphql-tag";
import resolvers from "./resolvers";

const DocumentModule = new GraphQLModule({
  typeDefs: gql``,
  resolvers
});

export default DocumentModule;

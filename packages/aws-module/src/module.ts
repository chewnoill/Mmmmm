import { GraphQLModule } from "@graphql-modules/core";
import gql from "graphql-tag";
import AuthModule from "auth-module";
import { AWSProvider } from "./providers";
import { Config } from "./types";
import { GraphQLJSONObject } from "graphql-type-json";

const AWSModule = new GraphQLModule<Config>({
  imports: [AuthModule],
  typeDefs: gql`
    scalar JSONObject

    type AWSPresignedURL {
      url: String!
      fields: JSONObject!
    }
  `,
  resolvers: {
    JSONObject: GraphQLJSONObject
  },
  providers: [AWSProvider]
});

export default AWSModule;

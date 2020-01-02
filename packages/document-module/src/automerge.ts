import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import { AutomergeText } from "shared";

export const AutoMergeState = new GraphQLScalarType({
  name: "AutoMergeState",
  description: "custom type representing a automerge state",
  parseValue(value: string) {
    return new AutomergeText(value);
  },
  serialize(value: AutomergeText) {
    return value.serialize();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new AutomergeText(ast.value);
    }
    return null;
  }
});

export const AutoMergeChange = new GraphQLScalarType({
  name: "AutoMergeChange",
  description: "custom type representing a single automergable change",
  parseValue(value) {
    return value;
  },
  serialize(value: string) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new AutomergeText(ast.value);
    }
    return null;
  }
});

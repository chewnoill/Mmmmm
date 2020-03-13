import { GraphQLModule, ModuleContext } from "@graphql-modules/core";
import { SchemaDirectiveVisitor } from "graphql-tools";

const authenticated = (func: any) => async (
  root: any,
  args: any,
  context: any,
  info: any
) => {
  if (!context.user) {
    throw new Error("Unauthorized");
  }
  return func(root, args, context, info);
};

export class AuthenticatedDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: any) {
    field.resolve = authenticated(field.resolve);
  }
}

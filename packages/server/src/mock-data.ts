import * as casual from "casual";
import { MockList } from "apollo-server-hapi";

export const mockData = {
  Cursor: () => "cursor",
  Collection: () => ({
    name: casual.catch_phrase
  }),
  ThingConnection: () => ({
    edges: () =>
      new MockList(5, () => ({
        __typename: "TextThing",
        value: casual.text
      }))
  }),
  User: () => ({
    email: casual.email
  }),
  TextThing: () => ({
    value: casual.text
  }),
  MeMutations: () => ({
    collection: (_, { id }: any) => ({
      id
    })
  }),
  UpdateCollectionMutations: () => ({
    updateThing: (_, { args: { id, value } }: any) => ({
      __typename: "TextThing",
      id,
      value
    }),
    update: ({ id }: any, { args: { name } }: any) => ({ id, name })
  })
};

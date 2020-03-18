import React, { Dispatch } from "react";
import { createSelector } from "reselect";

interface Context {
  selectedCollection: {
    id: string;
  };
  selectedThing?: {
    id: string;
  };
}

const CollectionFlow = React.createContext<[Context, Dispatch<Action>]>([
  {
    selectedCollection: {
      id: ""
    }
  },
  () => {}
]);

type UploadFile = { type: "upload-file"; thingId: string };
type OpenThing = { type: "open-thing"; thingId: string };
type CloseThing = { type: "close-thing" };

type Action = OpenThing | CloseThing | UploadFile;

const reducer = (state: Context, action: Action) => {
  switch (action.type) {
    case "open-thing":
      return {
        ...state,
        selectedThing: {
          id: action.thingId
        }
      };
    case "close-thing":
      return {
        ...state,
        selectedThing: undefined
      };
    default:
      return state;
  }
};

const middlewares: Array<(
  action: Action,
  state: Context,
  dispatch: Dispatch<Action>
) => void> = [];

const applyMiddlewares = (state: Context, dispatch: Dispatch<Action>) => (
  action: Action
) => {
  dispatch(action);
  middlewares.forEach(middleware => middleware(action, state, dispatch));
};

export const CollectionFlowProvider = ({
  id,
  children
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const [state, dispatch] = React.useReducer(reducer, {
    selectedCollection: { id }
  });

  return (
    <CollectionFlow.Provider
      value={[state, applyMiddlewares(state, dispatch)]}
      children={children}
    />
  );
};

export const getContext = createSelector(
  (c: [Context, Dispatch<Action>]) => c,
  c => c[0]
);

export const getDispatch = createSelector(
  (c: [Context, Dispatch<Action>]) => c,
  c => c[1]
);
const getSelectedCollectionId = createSelector(
  getContext,
  c => c.selectedCollection.id
);

const getSelectedThingId = createSelector(getContext, c => c.selectedThing?.id);

export const useCollectionFlow = () => React.useContext(CollectionFlow);

export const useSelectedCollectionId = () =>
  getSelectedCollectionId(useCollectionFlow());

export const useSelectedThingId = () => getSelectedThingId(useCollectionFlow());

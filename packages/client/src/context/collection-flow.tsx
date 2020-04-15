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

const selectContext = ({ context }: { context: Context }) => context;

const selectSelectedCollectionId = createSelector(
  selectContext,
  c => c.selectedCollection.id
);

const selectSelectedThingId = createSelector(
  selectContext,
  c => c.selectedThing?.id
);

const CollectionFlowState = React.createContext<Context>({
  selectedCollection: {
    id: ""
  }
});
type UploadFile = { type: "upload-file"; thingId: string };
type OpenThing = { type: "open-thing"; thingId: string };
type CloseThing = { type: "close-thing" };

type Action = OpenThing | CloseThing | UploadFile;

const CollectionFlowDispatch = React.createContext<Dispatch<Action>>(() => {});
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
    <CollectionFlowDispatch.Provider value={dispatch}>
      <CollectionFlowState.Provider value={state} children={children} />
    </CollectionFlowDispatch.Provider>
  );
};

type Selector<T> = (props: { context: Context }) => T;

export function useSelector<T>(fn: Selector<T>) {
  const context = React.useContext(CollectionFlowState);
  return fn({
    context
  });
}

export const useDispatch = () => React.useContext(CollectionFlowDispatch);

export const useSelectedCollectionId = () =>
  useSelector(selectSelectedCollectionId);

export const useSelectedThingId = () => useSelector(selectSelectedThingId);

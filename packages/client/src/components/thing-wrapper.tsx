import React from "react";
import styled from "@emotion/styled";
import { useUpdateThingMutation, TextThing } from "codegen";
import { useDispatch, useSelectedThingId } from "context/collection-flow";
import CodeModal from "components/code-modal";

const StyledThing = styled.div`
  position: relative;
  grid-column: 1/-1;
  padding: 4px;
  textarea {
    width: 100%;
    height: 100%;
    min-height: 50px;
  }
  .error {
    border: 2px solid red;
    :before {
      content: "there wasn an error";
      background: white;
      position: absolute;
      left: -2px;
      top: -27px;
      padding: 4px;
      border-left: 2px solid tomato;
      border-right: 2px solid tomato;
      border-top: 2px solid tomato;
    }
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    border: 2px solid tomato;
    height: 100%;
    width: 100%;

    :before {
      content: "edit";
      background: white;
      position: absolute;
      left: -2px;
      top: -27px;
      padding: 4px;
      border-left: 2px solid tomato;
      border-right: 2px solid tomato;
      border-top: 2px solid tomato;
    }
  }

  .fadein-onhover {
    opacity: 0;
    transition: opacity ease 0.2s;
  }

  :hover {
    .fadein-onhover {
      opacity: 0.8;
    }
  }
`;

interface Context {
  collectionId?: string;
  thing?: TextThing;
}

const ThingContext = React.createContext<Context>({});

export const ThingProvider = ThingContext.Provider;

export const ThingWrapper = ({ className, ...props }: any) => {
  const { collectionId, thing } = React.useContext(ThingContext);
  const dispatch = useDispatch();
  const selectedId = useSelectedThingId();

  const [content, setContent] = React.useState(thing?.value || "");
  const [mutate] = useUpdateThingMutation();

  if (!collectionId || !thing) return null;

  const showEdit = !!selectedId && selectedId === thing?.id;

  return (
    <StyledThing className={className}>
      <div {...props} />
      {!showEdit && (
        <button
          className="overlay fadein-onhover fill"
          onClick={() => dispatch({ type: "open-thing", thingId: thing.id })}
        />
      )}

      <CodeModal
        value={content}
        setValue={setContent}
        isOpen={showEdit}
        closeModal={() => {
          dispatch({ type: "close-thing" });
          mutate({
            variables: {
              collectionId,
              thingId: thing.id,
              value: content
            }
          });
        }}
      />
    </StyledThing>
  );
};

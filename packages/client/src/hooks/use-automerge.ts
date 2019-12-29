import React from "react";
import { AutomergeText } from "shared";
import {
  useSubscribeDocumentSubscription,
  useUpdateDocumentMutation
} from "codegen";
import { useForceUpdate } from "hooks/use-force-update";

export const useAutomerge = (id: string, contents: string) => {
  const automerge = React.useRef(new AutomergeText(contents));
  const [mutation] = useUpdateDocumentMutation();

  const { data } = useSubscribeDocumentSubscription({ variables: { id } });
  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    if (data && data.document) {
      automerge.current.applyChange(data.document);
      forceUpdate();
    }
  }, [data, forceUpdate]);

  return {
    text: automerge.current.text(),
    onChange: (newText: string) => {
      const change = automerge.current.mergeText(newText);
      mutation({ variables: { id, change } });
    }
  };
};

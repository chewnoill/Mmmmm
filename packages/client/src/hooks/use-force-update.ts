import React from "react";

export const useForceUpdate = () => {
  const [, updateState] = React.useState(0);
  return React.useCallback(() => updateState(state => state + 1), [
    updateState
  ]);
};

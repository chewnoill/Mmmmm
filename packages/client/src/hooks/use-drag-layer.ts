import React from "react";

export const useIsDragging = (ref?: React.RefObject<any>) => {
  const [dragging, setDragging] = React.useState(false);

  const current = ref ? ref.current : document;

  React.useEffect(() => {
    if (!current) return;
    console.log("setup");
    current.addEventListener(
      "drag",
      (e: any) => {
        console.log("drag");
        setDragging(true);
      },
      false
    );
    current.addEventListener(
      "dragstart",
      (e: any) => {
        console.log("drag start");
        setDragging(true);
      },
      false
    );

    current.addEventListener(
      "dragend",
      (e: any) => {
        console.log("drag end");
        setDragging(false);
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
  }, [ref, current]);

  console.log({ dragging });

  return dragging;
};

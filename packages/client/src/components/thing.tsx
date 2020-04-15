import React from "react";
import styled from "@emotion/styled";
import MdxComponent from "components/mdx-component";
import { ThingFragmentFragment, useGetMyThingQuery } from "codegen";
import { ThingProvider, ThingWrapper } from "components/thing-wrapper";

const StyledIframe = styled.iframe`
  height: 100vh;
  width: 100%;
  z-index: 2;
  overflow: hidden;
`;

const S3Thing = ({
  id,
  className,
  fileName = "alt"
}: {
  id: string;
  className: string;
  fileName?: string;
}) => {
  const { data } = useGetMyThingQuery({ variables: { thingId: id } });
  if (data?.me?.thing?.__typename === "ImageThing") {
    const { s3url, mimeType } = data.me.thing;
    if (mimeType.startsWith("image/")) {
      return <img className={className} alt={fileName} src={s3url} />;
    } else if (mimeType.startsWith("application/pdf")) {
      return (
        <StyledIframe
          className={className}
          src={`${s3url}#view=Fit&scrollbar=0&statusbar=0`}
        />
      );
    }
  }
  return null;
};

const ThingView = ({
  collectionId,
  thing
}: {
  collectionId: string;
  thing: ThingFragmentFragment;
}) => {
  if (thing.__typename !== "TextThing") return null;

  const { value } = thing;
  return (
    <ThingProvider value={{ collectionId, thing }}>
      <MdxComponent
        content={value}
        fallback={
          <ThingWrapper>
            <h1>something went wrong</h1>
          </ThingWrapper>
        }
        components={{
          S3Thing,
          wrapper: ThingWrapper,
          styled
        }}
        scope={{
          wrapper: ThingWrapper,
          styled
        }}
      />
    </ThingProvider>
  );
};

export default ThingView;

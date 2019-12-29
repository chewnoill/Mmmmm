import React from "react";
import { useGetDocumentQuery } from "codegen";
import { useAutomerge } from "hooks/use-automerge";

const Document = ({ id, contents }: { id: string; contents: string }) => {
  const { text, onChange } = useAutomerge(id, contents);

  return <textarea value={text} onChange={e => onChange(e.target.value)} />;
};

export default ({ id }: { id: string }) => {
  const { data } = useGetDocumentQuery({ variables: { id } });

  if (!data || !data.document || !data.document.document)
    return <div>loading</div>;
  return <Document id={id} contents={data.document.document.contents} />;
};

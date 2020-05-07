import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useParams } from "react-router-dom";
import {
  useGetMyCollectionQuery,
  useCreateThingMutation,
  GetMyCollectionDocument
} from "codegen";
import ThingView from "components/thing";
import { Div } from "ui";
import {
  CollectionFlowProvider,
  useSelectedCollectionId
} from "context/collection-flow";
import { Link } from "react-router-dom";

const gridCollection = css`
  width: 100%;
  position: relative;
  display: grid;
  grid-gap: 20px;
  grid-auto-columns: 200px;
  padding: 20px;
  grid-template-columns: repeat(12, 1fr);
`;

const Page = styled(Div)`
  .collection {
    ${gridCollection}
  }

  .menu {
    padding: 15px;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1;
    background: white;
    margin-bottom: 10px;

    h1 {
      margin: 0;
    }
  }
`;

const CollectionView = () => {
  const id = useSelectedCollectionId();
  const { data } = useGetMyCollectionQuery({
    variables: { collectionId: id! }
  });
  const [createThing] = useCreateThingMutation();

  if (!data || !data.me || !data.me.collection || !id) return null;
  const { name, things } = data.me.collection;

  return (
    <Page>
      <div className="menu">
        <h1 className="heading">name: {name}</h1>
        <button
          onClick={() =>
            createThing({
              variables: {
                collectionId: id,
                value: "# New Thing"
              },
              refetchQueries: [
                {
                  query: GetMyCollectionDocument,
                  variables: { collectionId: id }
                }
              ]
            })
          }
        >
          create thing
        </button>
        <Link to={`/collection/${id}/edit`}>edit collection settings</Link>
      </div>
      <div className="collection">
        {things.edges.map(({ edge }) => (
          <ThingView key={edge.id} collectionId={id} thing={edge} />
        ))}
      </div>
    </Page>
  );
};

export default () => {
  const { id } = useParams();

  if (!id) return null;
  return (
    <CollectionFlowProvider id={id}>
      <CollectionView />
    </CollectionFlowProvider>
  );
};

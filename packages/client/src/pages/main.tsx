import React from "react";
import styled from "@emotion/styled";
import {
  useGetMyProfileQuery,
  useCreateCollectionMutation,
  GetMyProfileDocument
} from "codegen";
import { Link } from "react-router-dom";
import { Div } from "ui";

const Page = styled(Div)`
  padding: 15px;
  header {
    margin-bottom: 10px;
  }
  .collection-list {
    display: flex;
    flex-direction: column;
  }
`;

export default () => {
  const { data } = useGetMyProfileQuery();
  const [createCollection] = useCreateCollectionMutation();
  if (!data || !data.me || !data.me.user) return <div>loading...</div>;

  return (
    <Page>
      <header>
        <div>hello {data.me.user.email}</div>
        <button
          onClick={() =>
            createCollection({
              variables: {
                name: "new collection"
              },
              refetchQueries: [{ query: GetMyProfileDocument }]
            })
          }
        >
          create collection
        </button>
      </header>
      <div className="collection-list">
        {data.me.user.collections.edges.map(({ edge: { id, name } }) => (
          <Link to={`/collection/${id}`}>{name}</Link>
        ))}
      </div>
    </Page>
  );
};

import React from "react";
import {
  useGetMyProfileQuery,
  useCreateCollectionMutation,
  GetMyProfileDocument
} from "codegen";
import { Link } from "react-router-dom";

export default () => {
  const { data } = useGetMyProfileQuery();
  const [createCollection] = useCreateCollectionMutation();
  if (!data || !data.me || !data.me.user) return <div>loading...</div>;

  return (
    <div>
      <div>hello {data.me.user.email}</div>
      {data.me.user.collections.edges.map(({ edge: { id, name } }) => (
        <Link to={`/collection/${id}`}>{name}</Link>
      ))}
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
    </div>
  );
};

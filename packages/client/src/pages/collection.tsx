import React from "react";
import DropZone from "components/drop-zone";
import { useParams } from "react-router-dom";
import { useGetMyCollectionQuery } from "codegen";

const CollectionView = () => {
  const { id } = useParams();
  const { data } = useGetMyCollectionQuery({
    variables: { collectionId: id! }
  });

  if (!data || !data.me || !data.me.collection || !id) return null;

  const { name, things } = data.me.collection;

  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <DropZone collectionId={id}>
        name: {name}
        {things.map(({ id, s3url }) => (
          <img key={id} src={s3url!} />
        ))}
      </DropZone>
    </div>
  );
};

export default CollectionView;

import React from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import {
  useGetMyCollectionQuery,
  useUpdateCollectionMutation,
  Collection
} from "codegen";
import { Div } from "ui";
import { useFormik } from "formik";

const Page = styled(Div)``;

const EditCollectionView = ({ collection }: { collection: Collection }) => {
  const [updateCollection] = useUpdateCollectionMutation();

  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      name: collection.name
    },
    onSubmit: values => {
      updateCollection({
        variables: { collectionId: collection.id, name: values.name }
      });
    }
  });

  const { name } = collection;

  return (
    <Page>
      <div className="form">
        <h1 className="heading">name: {name}</h1>
        <form onSubmit={handleSubmit}>
          name:
          <input
            id="name"
            type="text"
            value={values.name}
            onChange={handleChange}
          />
          <button>update thing</button>
        </form>
      </div>
    </Page>
  );
};

export default () => {
  const { id } = useParams();

  const { data } = useGetMyCollectionQuery({
    variables: { collectionId: id! }
  });

  if (!id || !data?.me?.collection) return null;
  return <EditCollectionView collection={data.me.collection} />;
};

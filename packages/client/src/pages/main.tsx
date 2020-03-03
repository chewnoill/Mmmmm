import React from "react";
import { useGetMyProfileQuery } from "codegen";
import DropZone from "components/drop-zone";
import { Link } from "react-router-dom";

export default () => {
  const { data } = useGetMyProfileQuery();
  if (!data || !data.me || !data.me.user) return <div>loading...</div>;

  return (
    <div>
      <div>hello {data.me.user.email}</div>
      {data.me.user.collections.map(({ id, name }) => (
        <Link to={`/collection/${id}`}>{name}</Link>
      ))}
    </div>
  );
};

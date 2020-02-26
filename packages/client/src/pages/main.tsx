import React from "react";
import { useMeQuery } from "codegen";

export default () => {
  const { data } = useMeQuery();
  if (!data || !data.auth || !data.auth.me || !data.auth.me.user)
    return <div>loading...</div>;

  return <div>hello {data.auth.me.user.email}</div>;
};

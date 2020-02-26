import React from "react";
import { useGetLoginUrlQuery } from "codegen";

export default () => {
  const { data } = useGetLoginUrlQuery();

  if (!data) return <div>loading</div>;

  window.location.href = data.auth.login_url;
  return <div>login</div>;
};

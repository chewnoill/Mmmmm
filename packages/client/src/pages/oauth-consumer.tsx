import React from "react";
import queryString from "query-string";
import { useLoginMutation } from "codegen";
import { useLocalStorage } from "hooks/use-local-storage";

const OAuthConsumer = ({ code }: { code: string }) => {
  const [loginMutation, { data, loading, error }] = useLoginMutation();
  const [, updateAuth] = useLocalStorage();

  React.useEffect(() => {
    loginMutation({ variables: { code } }).catch(() => {});
  }, [code, loginMutation]);

  React.useEffect(() => {
    if (data && data.auth && data.auth.login) {
      updateAuth(data.auth.login.authToken);
      window.location.href = "/";
    }
  }, [data, updateAuth]);

  if (loading) return <div>authorizing...</div>;
  if (error) return <div>unauthorized</div>;

  return <div>logged in</div>;
};

export default () => {
  const values = queryString.parse(window.location.search);
  const { code } = values;
  if (typeof code === "string") return <OAuthConsumer code={code} />;
  return <div>invaid code</div>;
};

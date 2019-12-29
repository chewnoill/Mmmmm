import React from "react";
import { ApolloProvider } from "react-apollo";
import { useApolloClient } from "utils/apollo-client";

const App: React.FC = () => {
  const client = useApolloClient();
  if (!client) return null;
  return (
    <ApolloProvider client={client}>
      <div>Hello Wold</div>
    </ApolloProvider>
  );
};

export default App;

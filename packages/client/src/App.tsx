import React from "react";
import { ApolloProvider } from "react-apollo";
import { useApolloClient } from "utils/apollo-client";
import Document from "components/document";

const App: React.FC = () => {
  const client = useApolloClient();
  if (!client) return null;
  return (
    <ApolloProvider client={client}>
      <Document id="1" />
    </ApolloProvider>
  );
};

export default App;

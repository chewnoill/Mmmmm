import React from "react";
import { ApolloProvider } from "react-apollo";
import { useApolloClient } from "utils/apollo-client";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "pages/login";
import OAuthConsumer from "pages/oauth-consumer";
import Main from "pages/main";
import Collection from "pages/collection";
import { useLocalStorage } from "hooks/use-local-storage";

const App: React.FC = () => {
  const [auth] = useLocalStorage();
  const client = useApolloClient(auth || undefined);
  if (!client) return null;
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/oauth_consumer">
            <OAuthConsumer />
          </Route>
          <Route path="/collection/:id">
            <Collection />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
};

export default App;

import React from "react";
import { Global } from "@emotion/core";
import "tachyons";
import { ApolloProvider } from "react-apollo";
import { useApolloClient } from "utils/apollo-client";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "pages/login";
import OAuthConsumer from "pages/oauth-consumer";
import Main from "pages/main";
import EditCollection from "pages/edit-collection";
import Collection from "pages/collection";
import StyleGuide from "pages/styleguide";
import { useLocalStorage } from "hooks/use-local-storage";
import { Page } from "ui";

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
          <Route path="/collection/:id/edit">
            <EditCollection />
          </Route>
          <Route path="/collection/:id">
            <Collection />
          </Route>
          <Route path="/styleguide">
            <StyleGuide />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
};

export default () => (
  <>
    <Global
      styles={{
        body: {
          margin: 0
        }
      }}
    />
    <Page>
      <App />
    </Page>
  </>
);

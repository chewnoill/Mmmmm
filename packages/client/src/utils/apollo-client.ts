import {
  IntrospectionFragmentMatcher,
  InMemoryCache,
  NormalizedCacheObject
} from "apollo-cache-inmemory";
import { introspection } from "codegen";
import { createHttpLink } from "apollo-link-http";
import ApolloClient from "apollo-client";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "apollo-link-ws";
import { ApolloLink } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { useEffect, useState } from "react";
import { WEBSOCKET_ENDPOINT, HTTP_ENDPOINT } from "env";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspection
});

const cache = new InMemoryCache({
  fragmentMatcher
});

// Create WebSocket client
const wsClient = new SubscriptionClient(WEBSOCKET_ENDPOINT, {
  reconnect: true
});

type State = undefined | ApolloClient<NormalizedCacheObject>;

export const useApolloClient = (token?: string) => {
  const [client, setClient] = useState<State>();
  useEffect(() => {
    const httpLink = createHttpLink({
      uri: HTTP_ENDPOINT,
      headers: {
        authorization: token ? `Bearer ${token}` : ""
      },
      credentials: "include"
    });
    const link = ApolloLink.split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query) as any;
        return kind === "OperationDefinition" && operation! === "subscription";
      },
      new WebSocketLink(wsClient),
      httpLink
    );

    const client = new ApolloClient({
      cache,
      link
    });
    setClient(client);
  }, [token]);

  return client;
};

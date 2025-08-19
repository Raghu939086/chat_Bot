import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { createClient } from 'graphql-ws';
import { nhost } from './nhost';

// 1. GraphQL endpoint
const httpUrl = nhost.graphql.getUrl();
const wsUrl = httpUrl.replace('http', 'ws');

// 2. HTTP auth middleware (adds token to headers)
const authLink = setContext(async (_, { headers }) => {
  const token = await nhost.auth.getAccessToken();
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

// 3. HTTP link
const httpLink = new HttpLink({
  uri: httpUrl,
});

// 4. WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: wsUrl,
    connectionParams: async () => {
      const token = await nhost.auth.getAccessToken();
      return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    },
  })
);

// 5. Split: queries/mutations → HTTP, subscriptions → WS
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink) // attach auth middleware to HTTP
);

// 6. Apollo Client
export const apollo = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

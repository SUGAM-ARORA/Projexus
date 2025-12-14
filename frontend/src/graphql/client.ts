import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import toast from 'react-hot-toast';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:8000/graphql/',
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      toast.error(`GraphQL Error: ${message}`);
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    toast.error(`Network Error: ${networkError.message}`);
  }
});

// Auth link (for future JWT implementation)
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('authToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'X-Organization-Slug': localStorage.getItem('organizationSlug') || '',
    },
  };
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          projects: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          tasks: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});


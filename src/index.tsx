import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';

import { ERKENNINGEN_GRAPHQL_API_URL } from '@erkenningen/config';

import './index.scss';

import App from './App';

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: new HttpLink({
    uri: ERKENNINGEN_GRAPHQL_API_URL,
    credentials: 'include',
  }),
  cache,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <HashRouter>
        <App />
      </HashRouter>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('module-change-license'),
);

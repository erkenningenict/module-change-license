// Add IE11 support
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'es6-shim';
import 'react-app-polyfill/ie11';

import { ERKENNINGEN_GRAPHQL_API_URL, ERKENNINGEN_SITE_TYPE } from '@erkenningen/config';
import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeContext } from '@erkenningen/ui';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { HashRouter, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import App from './App';

const cache = new InMemoryCache();
const apiUrl = process.env.REACT_APP_GRAPHQL_API_URL
  ? process.env.REACT_APP_GRAPHQL_API_URL
  : ERKENNINGEN_GRAPHQL_API_URL;

const client = new ApolloClient({
  link: new HttpLink({
    uri: apiUrl,
    credentials: 'include',
  }),
  cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeContext.Provider value={{ mode: ERKENNINGEN_SITE_TYPE }}>
      <HashRouter>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Route
            path={'/'}
            exact={true}
            render={(props: any) => {
              props.history.push('licenties');
              return null;
            }}
          />
          <App />
        </QueryParamProvider>
      </HashRouter>
    </ThemeContext.Provider>
  </ApolloProvider>,
  document.getElementById('module-change-license'),
);
import React from 'react';
import ReactDOM from 'react-dom';
// import 'core-js';
// import 'es6-shim';
// import 'react-app-polyfill/ie11';
import { HashRouter, Route } from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { QueryParamProvider } from 'use-query-params';
import { ThemeContext } from '@erkenningen/ui';
import { ERKENNINGEN_GRAPHQL_API_URL, ERKENNINGEN_SITE_TYPE } from '@erkenningen/config';

import App from './App';

const cache = new InMemoryCache();
// const apiUrl = process.env.NODE_ENV === 'development' ? '/graphql' : ERKENNINGEN_GRAPHQL_API_URL;

const client = new ApolloClient({
  link: new HttpLink({
    uri: ERKENNINGEN_GRAPHQL_API_URL,
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

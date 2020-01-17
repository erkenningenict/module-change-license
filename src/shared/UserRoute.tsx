import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { PersonContext } from './PersonContext';

// TODO Implement UserRoute later
export default function UserRoute({ component: Component, ...rest }) {
  const user = useContext(PersonContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/licenties', state: { from: props.location } }} />
        )
      }
    />
  );
}

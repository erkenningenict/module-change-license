import { useQuery } from '@apollo/react-hooks';
import { Alert } from '@erkenningen/ui';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import React from 'react';
import { NumberParam, useQueryParam } from 'use-query-params';
import './App.scss';
import Licenses from './components/Licenses/Licenses';
import { NewLicense } from './components/NewLicense/NewLicense';
import { PersonContext } from './shared/PersonContext';
import { GET_MY_ROLES_QUERY, IMy } from './shared/Queries';
import UserRoute from './shared/UserRoute';

export default function App() {
  const [personId] = useQueryParam('personId', NumberParam);
  const { loading, error, data } = useQuery<IMy>(GET_MY_ROLES_QUERY);
  if (loading) {
    return <p>Gegevens worden geladen...</p>;
  }
  if (error) {
    // Check if it's an authentication error
    if (error.graphQLErrors) {
      for (const err of error.graphQLErrors) {
        if (err.extensions && err.extensions.code === 'UNAUTHENTICATED') {
          return (
            <Alert type="danger">U bent niet geautoriseerd om deze module te gebruiken.</Alert>
          );
        } else {
          return (
            <Alert type="danger">
              Er is een fout opgetreden bij het ophalen van de accountgegevens. Probeer het nog een
              keer of neem contact op met de helpdesk.
            </Alert>
          );
        }
      }
    }
    return (
      <Alert type="danger">
        Er is een fout opgetreden bij het ophalen van de accountgegevens. Probeer het nog een keer
        of neem contact op met de helpdesk.
      </Alert>
    );
  }
  if (!data || !data.my || data.my.Roles === null) {
    return null;
  }
  if (data.my.Roles && data.my.Roles.indexOf('Rector') === -1) {
    return <Alert type="danger">U heeft niet de juiste rol voor deze actie.</Alert>;
  }
  // PersonContext.
  return (
    <>
      <PersonContext.Provider value={personId}>
        <UserRoute path="/licenties" exact={true} component={Licenses} />
        <UserRoute path="/licenties/nieuw" exact={true} component={NewLicense} />
      </PersonContext.Provider>
    </>
  );
}

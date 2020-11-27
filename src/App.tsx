import React from 'react';
import { ThemeContext } from '@erkenningen/ui';
import { ERKENNINGEN_SITE_TYPE } from '@erkenningen/config';
import { Alert } from '@erkenningen/ui/components/alert';
import { NumberParam, useQueryParam } from 'use-query-params';
import Licenses from './components/Licenses/Licenses';
import { NewLicense } from './components/NewLicense/NewLicense';
import { PersonContext } from './shared/PersonContext';
import UserRoute from './shared/UserRoute';
import { ThemeBureauErkenningen } from '@erkenningen/ui/layout/theme';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import { useAuth, Roles, hasOneOfRoles } from './shared/Auth';

export default function App(): JSX.Element | null {
  const [personId] = useQueryParam('personId', NumberParam);
  const auth = useAuth();

  if (auth.loading) {
    return <p>Gegevens worden geladen...</p>;
  }

  if (auth.error) {
    return (
      <Alert type="danger">
        Er is een fout opgetreden bij het ophalen van de accountgegevens. Probeer het nog een keer
        of neem contact op met de helpdesk.
      </Alert>
    );
  }

  if (!auth.authenticated) {
    return <Alert type="danger">U moet ingelogd zijn om gegevens te bekijken.</Alert>;
  }

  if (!hasOneOfRoles([Roles.Rector], auth.my?.Roles)) {
    return <Alert type="danger">U heeft geen toegang tot deze module.</Alert>;
  }

  if (!personId) {
    return <Alert type="danger">PersoonID in de url is verplicht</Alert>;
  }

  return (
    <>
      <ThemeContext.Provider value={{ mode: ERKENNINGEN_SITE_TYPE }}>
        <ThemeBureauErkenningen>
          <PersonContext.Provider value={personId}>
            <UserRoute path="/licenties" exact={true} component={Licenses} />
            <UserRoute path="/licenties/nieuw" exact={true} component={NewLicense} />
          </PersonContext.Provider>
        </ThemeBureauErkenningen>
      </ThemeContext.Provider>
    </>
  );
}

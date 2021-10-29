import React from 'react';

import { FormatErrorParams } from 'yup';
import * as yup from 'yup';

import { ThemeContext } from '@erkenningen/ui';
import { ERKENNINGEN_SITE_TYPE } from '@erkenningen/config';
import { Alert } from '@erkenningen/ui/components/alert';
import { ThemeBureauErkenningen } from '@erkenningen/ui/layout/theme';

import { useAuth, Roles, hasOneOfRoles } from './shared/Auth';

import Routes from './features/Routes';
import { Route } from 'react-router-dom';

// @TODO Move to lib?
yup.setLocale({
  mixed: {
    default: 'Ongeldig',
    required: 'Verplicht',
    notType: (params: FormatErrorParams) => {
      if (!params.value) {
        return 'Verplicht';
      }

      switch (params.type) {
        case 'number':
          return 'Moet een getal zijn';
        case 'date':
          return 'Verplicht';
        default:
          return 'Ongeldige waarde';
      }
    },
  },
  string: {
    email: 'Ongeldig e-mailadres',
    min: 'Minimaal ${min} karakters', // eslint-disable-line no-template-curly-in-string
    max: 'Maximaal ${max} karakters', // eslint-disable-line no-template-curly-in-string
  },
});

const App: React.FC<{}> = (props) => {
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

  return (
    <>
      <ThemeContext.Provider value={{ mode: ERKENNINGEN_SITE_TYPE }}>
        <ThemeBureauErkenningen>
          <Route path="/:personId" component={Routes} />
        </ThemeBureauErkenningen>
      </ThemeContext.Provider>
    </>
  );
};

export default App;

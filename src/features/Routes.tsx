import { Alert } from '@erkenningen/ui/components/alert';
import { PanelBody } from '@erkenningen/ui/layout/panel';
import React, { useEffect } from 'react';
import { Route, useParams } from 'react-router-dom';
import { useGetCertificeringenQuery, useGetPersoonQuery } from '../generated/graphql';
import { useStore } from '../shared/Store';
import Cards from './Cards/Cards';
import NewCard from './Cards/NewCard';
import Licenses from './Licenses/Licenses';
import NewLicense from './NewLicense/NewLicense';
import PersonDetails from './Person/PersonDetails';

const Routes: React.FC<{}> = (props) => {
  const { personId } = useParams<any>();
  const store = useStore();

  const { loading, error, data, refetch } = useGetCertificeringenQuery({
    variables: { personId: +personId },
    skip: !personId,
    fetchPolicy: 'network-only',
  });

  const { loading: personLoading, data: personData } = useGetPersoonQuery({
    variables: { personId: +personId },
    skip: !personId,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    store.setStore({
      personId: personId && !isNaN(+personId) ? +personId : undefined,
      person: personData?.Persoon,
      licenses: data?.Certificeringen || [],
      licensesLoading: loading || personLoading,
    });

    // eslint-disable-next-line
  }, [loading, data, personData, personLoading]);

  useEffect(() => {
    if (store.refreshTrigger) {
      refetch({ personId: +personId });

      store.setStore({ refreshTrigger: false });
    }
    // eslint-disable-next-line
  }, [store.refreshTrigger]);

  if (!personId || isNaN(parseInt(personId))) {
    return <Alert type="danger">PersoonID in de url is verplicht</Alert>;
  }

  if (error) {
    return (
      <PanelBody key="2">
        <Alert type="danger" key="1">
          Er is een fout opgetreden, probeer het later opnieuw.
        </Alert>
      </PanelBody>
    );
  }

  return (
    <>
      <PersonDetails />
      <Route path="/:personId/licenties" exact={true} component={Licenses} />
      <Route path="/:personId/licenties/nieuw" exact={true} component={NewLicense} />
      <Route path="/:personId/licenties/:licenseId/passen" exact={true} component={Cards} />
      <Route path="/:personId/licenties/:licenseId/passen/nieuw" exact={true} component={NewCard} />
    </>
  );
};

export default Routes;

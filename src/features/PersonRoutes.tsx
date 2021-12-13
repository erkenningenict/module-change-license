import { Alert } from '@erkenningen/ui/components/alert';
import { PanelBody } from '@erkenningen/ui/layout/panel';
import React, { useEffect } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { useGetCertificeringenQuery, useGetPersoonQuery } from '../generated/graphql';
import { useStore } from '../shared/Store';
import Cards from './Cards/Cards';
import NewCard from './Cards/NewCard';
import Licenses from './Licenses/Licenses';
import NewLicense from './NewLicense/NewLicense';
import PersonDetails from './Person/PersonDetails';

const PersonRoutes: React.FC = () => {
  const params = useParams<any>();
  const store = useStore();
  const { personId } = params;

  const { loading, error, data, refetch } = useGetCertificeringenQuery({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { personId: +personId! },
    skip: !personId,
    fetchPolicy: 'network-only',
  });

  const { loading: personLoading, data: personData } = useGetPersoonQuery({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { personId: +personId! },
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      refetch({ personId: +personId! });

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
      <Routes>
        <Route path="licenties" element={<Licenses />} />
        <Route path="licenties/nieuw" element={<NewLicense />} />
        <Route path="licenties/:licenseId/passen" element={<Cards />} />
        <Route path="licenties/:licenseId/passen/nieuw" element={<NewCard />} />
      </Routes>
    </>
  );
};

export default PersonRoutes;

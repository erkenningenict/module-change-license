import { useQuery } from '@apollo/react-hooks';
import { Alert, Button, Panel, PanelBody, TableResponsive } from '@erkenningen/ui';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { PersonContext } from '../../shared/PersonContext';
import { GET_LICENSES_QUERY } from '../../shared/Queries';
import { LicenseRow } from './LicenseRow';

export default function Licenses(props: any) {
  const personId = useContext(PersonContext);
  const history = useHistory();

  const { loading, error, data } = useQuery<any>(GET_LICENSES_QUERY, {
    variables: { personId },
    fetchPolicy: 'network-only',
  });
  if (loading) {
    return <p>Gegevens worden geladen...</p>;
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

  if (!data) {
    return null;
  }

  return (
    <>
      <Panel title="Licenties van persoon">
        <TableResponsive>
          <table className="table table-striped" key="table">
            <thead>
              <tr key="headerRow">
                <th>Actie</th>
                <th>Licentie</th>
                <th>Status</th>
                <th>Nummer</th>
                <th className="text-right">Begindatum</th>
                <th className="text-right">Einddatum</th>
                <th>Opmerking</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.Certificeringen.map((row) => (
                  <LicenseRow row={row} key={row.CertificeringID} />
                ))}
              {!data || data.Certificeringen.length === 0 ? (
                <tr>
                  <td colSpan={3}>
                    <Alert type="info">Geen licenties gevonden.</Alert>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </TableResponsive>
        <Button
          label="Licentie toevoegen"
          icon="pi pi-plus"
          onClick={() => {
            history.push(`licenties/nieuw/${props.location.search}`);
          }}
        />
      </Panel>
    </>
  );
}

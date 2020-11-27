import React, { useContext } from 'react';
import { Alert } from '@erkenningen/ui/components/alert';
import { Button } from '@erkenningen/ui/components/button';
import { Panel, PanelBody } from '@erkenningen/ui/layout/panel';
import { TableResponsive } from '@erkenningen/ui/layout/table';
import { useHistory } from 'react-router-dom';
import { useGetCertificeringenQuery } from '../../generated/graphql';
import { PersonContext } from '../../shared/PersonContext';
import { LicenseRow } from './LicenseRow';

const Licenses: React.FC<any> = (props) => {
  const personId = useContext(PersonContext);
  const history = useHistory();

  const { loading, error, data } = useGetCertificeringenQuery(
    {variables: { personId: personId !== null && personId ? personId : 0 },
    skip: !personId || personId === null,
    fetchPolicy: 'network-only',
  });
  if (!personId || personId === null) {
    return (
      <PanelBody key="2">
        <Alert type="danger" key="1">
          PersoonID is verplicht in de url.
        </Alert>
      </PanelBody>
    );
  }
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
      <Panel title="Licenties van persoon" doNotIncludeBody={true}>
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
              {
                data?.Certificeringen?.map((row) => (
                  <LicenseRow row={row} key={row.CertificeringID} />
                ))}
              {!data || data?.Certificeringen?.length === 0 ? (
                <tr>
                  <td colSpan={3}>
                    <Alert type="info">Geen licenties gevonden.</Alert>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </TableResponsive>
        <PanelBody>
        <Button
          label="Licentie toevoegen"
          className="mr-2"
          icon="fa fa-check"
          buttonType="submit"
          onClick={(): void => {
            history.push(`licenties/nieuw/${props.location.search}`);
          }}
        />
        </PanelBody>
      </Panel>
    </>
  );
};

export default Licenses;

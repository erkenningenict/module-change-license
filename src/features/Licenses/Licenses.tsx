import React from 'react';
import { Alert } from '@erkenningen/ui/components/alert';
import { Button } from '@erkenningen/ui/components/button';
import { Panel, PanelBody } from '@erkenningen/ui/layout/panel';
import { TableResponsive } from '@erkenningen/ui/layout/table';
import { useHistory, useParams } from 'react-router-dom';
import { useGetCertificeringenQuery } from '../../generated/graphql';
import { LicenseRow } from './LicenseRow';
import { useStore } from '../../shared/Store';

const Licenses: React.FC<any> = (props) => {
  const history = useHistory();
  const store = useStore();

  if (store.licensesLoading) {
    return <p>Gegevens worden geladen...</p>;
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
              {store.licenses.map((row) => (
                <LicenseRow row={row} key={row.CertificeringID} />
              ))}
              {store.licenses.length === 0 ? (
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
              history.push(`/${store.personId}/licenties/nieuw`);
            }}
          />
        </PanelBody>
      </Panel>
    </>
  );
};

export default Licenses;

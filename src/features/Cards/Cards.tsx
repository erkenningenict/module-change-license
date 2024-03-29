import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { Column } from 'primereact/column';

import { Spinner } from '@erkenningen/ui/components/spinner';
import { Panel } from '@erkenningen/ui/layout/panel';
import { DataTable } from '@erkenningen/ui/components/datatable';
import { Button } from '@erkenningen/ui/components/button';
import { Row } from '@erkenningen/ui/layout/row';
import { Col } from '@erkenningen/ui/layout/col';
import { Alert } from '@erkenningen/ui/components/alert';
import { toDutchDate } from '@erkenningen/ui/utils';
import { LicenseCard } from '@erkenningen/ui/components/license-card';

import Loader from '../../components/Loader';
import { useStore } from '../../shared/Store';

const Cards: React.FC = () => {
  const store = useStore();
  const navigate = useNavigate();

  const { licenseId } = useParams<any>();

  if (store.licensesLoading) {
    return (
      <Panel title="Licentie" className="form-horizontal">
        <Spinner text={'Gegevens laden...'} />
      </Panel>
    );
  }

  if (!licenseId) {
    return (
      <Panel title="Licentie" className="form-horizontal">
        <Alert type="danger">Licentie niet gevonden</Alert>
      </Panel>
    );
  }

  const license = store.licenses.find((license) => license.CertificeringID === +licenseId);

  if (!licenseId || !license) {
    return (
      <Panel title="Licentie" className="form-horizontal">
        <Alert type="danger">Licentie niet gevonden</Alert>
      </Panel>
    );
  }

  return (
    <>
      <LicenseCard license={license as any} />
      <Row className={'mb-1'}>
        <Col>
          <Button
            label="Pas aanmaken"
            className="mr-2"
            icon="fa fa-plus"
            type="submit"
            onClick={(): void => {
              navigate(`/${store.personId}/licenties/${license.CertificeringID}/passen/nieuw`);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Panel title="Passen" className="form-horizontal" doNotIncludeBody={true}>
            <Loader loading={false}>
              <DataTable
                value={license.Passen}
                dataKey="PasID"
                emptyMessage="Er zijn nog geen passen aangemaakt."
                autoLayout={true}
                className={'p-datatable-striped p-datatable-clean'}
              >
                <Column
                  field="DatumAanvraag"
                  header={'Datum aanvraag'}
                  sortable={true}
                  sortField={'DatumAanvraag'}
                  body={(row: any) => toDutchDate(row.DatumAanvraag)}
                />
                <Column
                  field="DatumUitgeleverd"
                  header={'Datum uitgeleverd'}
                  sortable={true}
                  sortField={'DatumUitgeleverd'}
                  body={(row: any) => toDutchDate(row.DatumUitgeleverd)}
                />
                <Column field="Aantal" header={'Aantal'} />
                <Column field="Status" header={'Status'} />
                <Column field="BriefVerstuurd" header={'Brief verstuurd'} />
              </DataTable>
            </Loader>
          </Panel>
        </Col>
      </Row>
      <Button
        label={'Terug naar overzicht'}
        onClick={() => navigate(`/${store.personId}/licenties`)}
        buttonType={'light'}
      />
    </>
  );
};

export default Cards;

import React from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { FormikProps } from 'formik';
import * as yup from 'yup';

import { Button } from '@erkenningen/ui/components/button';
import { Panel, PanelBody } from '@erkenningen/ui/layout/panel';
import { Spinner } from '@erkenningen/ui/components/spinner';
import { Alert } from '@erkenningen/ui/components/alert';

import useToast from '../../components/Toast';
import { useStore } from '../../shared/Store';
import Form from '../../components/Form';
import { FormCalendar, FormCheckbox, FormNumber, FormText } from '@erkenningen/ui/components/form';
import { useCreatePasMutation } from '../../generated/graphql';

const NewCard: React.FC = () => {
  const store = useStore();
  const navigate = useNavigate();
  const { licenseId } = useParams<any>();
  const { showSuccess, showError } = useToast();

  const [createPas] = useCreatePasMutation();

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
      <Panel title="Pas aanmaken" className="form-horizontal">
        <PanelBody>
          <p>U gaat nu een nieuwe pas aanmaken voor persoon met PersoonID: {store.personId}.</p>
        </PanelBody>

        <Form
          schema={{
            requestDate: [new Date(), yup.date().required()],
            amount: [1, yup.number().required().min(1).max(10).integer()],
            createInvoice: [false, yup.bool()],
            remark: ['', yup.string().notRequired()],
          }}
          onSubmit={async (values) => {
            const result = await createPas({
              variables: {
                input: {
                  licenseId: +(license.CertificeringID || 0),
                  requestDate: values.requestDate,
                  amount: parseInt(values.amount),
                  createInvoice: !!values.createInvoice,
                },
              },
            });
            if (result.data?.createPas?.success) {
              showSuccess('Pas aanmaken', 'Succesvol een pas aangemaakt');
              store.refresh();
              navigate(`/${store.personId}/licenties/${licenseId}/passen`);
            } else {
              showError('Pas aanmaken mislukt', 'Pas aanmaken is mislukt, controleer uw invoer.');
            }
          }}
        >
          {(formikProps: FormikProps<any>) => (
            <>
              <FormCalendar label="Aanvraagdatum" name="requestDate"></FormCalendar>
              <FormNumber label={'Aantal'} name={'amount'} />
              <FormCheckbox
                label={'Factuur aanmaken'}
                name={'createInvoice'}
                helpText={
                  'Aangevinkt: pas wordt verstuurd als de klant heeft betaald. Niet aangevinkt: pas wordt direct verstuurd.'
                }
              />
              <FormText label="Opmerking" name="remark"></FormText>
              <div className="form-group">
                <div className="col-md-offset-3 col-md-6">
                  <Button
                    label="Pas aanmaken"
                    className="mr-2"
                    icon="fa fa-check"
                    type="submit"
                    disabled={formikProps.isSubmitting}
                    loading={formikProps.isSubmitting}
                  />
                  <span style={{ marginLeft: '15px' }}>
                    <Link to={`/${store.personId}/licenties/${licenseId}/passen`}>Terug</Link>
                  </span>
                </div>
              </div>
            </>
          )}
        </Form>
      </Panel>
    </>
  );
};

export default NewCard;

import React from 'react';

import { add, isValid } from 'date-fns';
import { Formik } from 'formik';
import { Link, useHistory } from 'react-router-dom';
import { number, object, string, date } from 'yup';

import { Alert } from '@erkenningen/ui/components/alert';
import { Panel, PanelBody } from '@erkenningen/ui/layout/panel';
import { Button } from '@erkenningen/ui/components/button';
import { Spinner } from '@erkenningen/ui/components/spinner';
import { FormCalendar, FormSelect, FormText } from '@erkenningen/ui/components/form';

import { useCreateLicenseMutation, useGetListsQuery } from '../../generated/graphql';
import { useStore } from '../../shared/Store';
import useToast from '../../components/Toast';

const dateTransform = (curVal: any) => {
  return isValid(new Date(curVal)) ? curVal : undefined;
};

const CreateLicenseSchema = object().shape({
  certificateId: number()
    .min(1, 'Kies een certificaat uit de lijst')
    .required('Kies een certificaat'),
  remark: string().required('Toelichting is verplicht'),
  startDate: date()
    .transform(dateTransform)
    .min(new Date(2015, 0, 1), 'Startdatum moet minimaal 1-1-2015 zijn')
    .required('Startdatum is verplicht'),
  endDate: date()
    .transform(dateTransform)
    .min(new Date(2015, 0, 1), 'Einddatum moet minimaal 1-1-2015 zijn')
    .when('startDate', (startDate: Date, schema: any) => {
      return startDate && schema.min(startDate, 'Einddatum moet na begindatum liggen');
    })
    .required('Einddatum is verplicht'),
});

const NewLicense: React.FC<{}> = (props) => {
  const store = useStore();
  const history = useHistory();
  const { showSuccess, showError } = useToast();
  const { loading, data, error } = useGetListsQuery();

  const returnToListLink = <Link to={`/${store.personId}/licenties`}>Terug</Link>;

  const [createLicense, { loading: mutationLoading }] = useCreateLicenseMutation({});
  if (loading || mutationLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <Alert type="danger">Fout bij ophalen lijsten...</Alert>;
  }

  if (!data) {
    return null;
  }
  return (
    <Panel title="Licentie toevoegen">
      <PanelBody>
        <p>U gaat nu een nieuwe licentie aanmaken voor persoon met PersoonID: {store.personId}.</p>
        <p>
          De licentie wordt aangemaakt per aangegeven datum en een pas wordt klaargezet voor
          verzending (met status betaald).
        </p>
      </PanelBody>

      <Formik
        initialValues={{
          certificateId: 0,
          startDate: new Date(),
          endDate: add(new Date(), { years: 5 }),
          isExtensionOf: 0,
          remark: '',
        }}
        validationSchema={CreateLicenseSchema}
        onSubmit={async (values: any) => {
          if (!store.personId) {
            return;
          }
          const input = {
            personId: store.personId,
            certificateId: values.certificateId,
            startDate: values.startDate,
            endDate: values.endDate,
            isExtensionOf: values.isExtensionOf,
            remark: values.remark,
          };
          const result = await createLicense({ variables: { input } });

          if (result.data?.createLicense?.NummerWeergave?.length) {
            showSuccess(
              'Licentie toevoegen',
              `Licentie is aangemaakt met nummer: ${result.data.createLicense.NummerWeergave}.`,
            );
            store.refresh();
            history.push(`/${store.personId}/licenties`);
          } else {
            showError('Licentie toevoegen', 'Fout opgetreden bij toevoegen licentie');
          }
        }}
      >
        {(props) => {
          const certs = data?.Certificaten?.slice(0)
            .sort((a, b) => (a.Naam > b.Naam ? 1 : -1))
            ?.map((item) => {
              return {
                value: item.CertificaatID,
                label: item.Naam,
              };
            });
          return (
            <form onSubmit={props.handleSubmit} className="form form-horizontal" noValidate>
              <FormSelect
                label="Certificaat"
                form={props}
                name="certificateId"
                labelClassNames="col-md-3"
                formControlClassName="col-md-4"
                options={certs || []}
              ></FormSelect>
              <FormCalendar
                label="Startdatum"
                name="startDate"
                form={props}
                labelClassNames="col-md-3"
                formControlClassName="col-md-4"
              ></FormCalendar>
              <FormCalendar
                label="Einddatum"
                name="endDate"
                form={props}
                labelClassNames="col-md-3"
                formControlClassName="col-md-4"
              ></FormCalendar>
              <FormText
                label="Toelichting"
                name="remark"
                onChange={props.handleChange}
                value={props.values.remark}
              ></FormText>
              <div className="form-group">
                <div className="col-md-offset-3 col-md-6">
                  <Button
                    label="Licentie aanmaken"
                    className="mr-2"
                    icon="fa fa-check"
                    buttonType="submit"
                    disabled={props.isSubmitting}
                  />
                  <span style={{ marginLeft: '15px' }}>{returnToListLink}</span>
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </Panel>
  );
};

export default NewLicense;

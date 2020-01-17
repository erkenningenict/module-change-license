import { useMutation, useQuery } from '@apollo/react-hooks';
import { Alert, Button, Panel, PanelBody, Spinner } from '@erkenningen/ui';
import { add, isBefore, isDate } from 'date-fns';
import { Formik } from 'formik';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { number, object, string } from 'yup';
import { CREATE_LICENSE, ICreateLicenseInput } from '../../shared/Mutations';
import { PersonContext } from '../../shared/PersonContext';
import { IListsQuery, LISTS } from '../../shared/Queries';
import FormCalendar from '../ui/FormCalendar';
import FormSelect from '../ui/FormSelect';
import FormText from '../ui/FormText';

const CreateLicenseSchema = object().shape({
  certificateId: number()
    .min(1, 'Kies een certificaat uit de lijst')
    .required('Kies een certificaat'),
  startDate: string().required('Startdatum is verplicht'),
  remark: string().required('Toelichting is verplicht'),
  endDate: string()
    .required('Einddatum is verplicht')
    .when('startDate', (startDate: string, schema: any) => {
      const start = new Date(startDate);
      return schema.test({
        test: (endDate: string) => {
          const end = new Date(endDate);
          return isBefore(start, end);
        },
        message: 'Einddatum moet na startdatum liggen',
      });
    }),
});

export function NewLicense(properties: any) {
  const personId = useContext(PersonContext);
  const { loading, data, error } = useQuery<IListsQuery>(LISTS);

  const search = (properties.location && properties.location && properties.location.search) || '';
  const returnToListLink = <Link to={`/licenties${search}`}>Terug</Link>;

  const [
    createLicense,
    { loading: mutationLoading, error: mutationError, data: mutationData },
  ] = useMutation<{ createLicense: { NummerWeergave: string } }, { input: ICreateLicenseInput }>(
    CREATE_LICENSE,
  );
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
  if (mutationError) {
    return (
      <PanelBody>
        <Alert type="danger">Fout bij opslaan gegevens...</Alert>
      </PanelBody>
    );
  }
  if (mutationData && mutationData.createLicense.NummerWeergave) {
    return (
      <PanelBody>
        <Alert type="success">
          Licentie is aangemaakt met nummer: {mutationData.createLicense.NummerWeergave}.
        </Alert>
        {returnToListLink}
      </PanelBody>
    );
  }
  if (!data) {
    return null;
  }
  return (
    <Panel title="Licentie toevoegen">
      <PanelBody>
        <p>U gaat nu een nieuwe licentie aanmaken voor persoon met PersoonID: {personId}.</p>
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
        onSubmit={(values, { setSubmitting }) => {
          if (!personId) {
            return;
          }
          const input: ICreateLicenseInput = {
            personId,
            certificateId: values.certificateId,
            startDate: values.startDate,
            endDate: values.endDate,
            isExtensionOf: values.isExtensionOf,
            remark: values.remark,
          };
          createLicense({ variables: { input } });
        }}
        render={(props: any) => {
          return (
            <form onSubmit={props.handleSubmit} className="form form-horizontal">
              <FormSelect
                id="certificate"
                label="Certificaat"
                options={data.Certificaten.sort((a: any, b: any) => (a.Naam > b.Naam ? 1 : -1)).map(
                  (item: any) => ({
                    value: parseInt(item.CertificaatID, 10),
                    label: item.Naam,
                  }),
                )}
                name="certificateId"
                loading={loading}
                form={props}
              />
              <FormCalendar
                id="startDate"
                label="Begindatum"
                form={props}
                key="startDate"
                name="startDate"
                onChange={(e) => {
                  if (e.value && isDate(e.value)) {
                    const over5Years = add(e.value, { years: 5 });
                    props.setFieldValue('endDate', over5Years);
                  }
                }}
              />
              <FormCalendar
                id="endDate"
                label="Einddatum"
                form={props}
                key="endDate"
                name="endDate"
              />
              <FormText id="remark" label="Toelichting" form={props} name="remark" />
              <div className="form-group">
                <div className="col-md-offset-3 col-md-6">
                  <Button
                    buttonType="submit"
                    label="Licentie aanmaken"
                    icon="pi pi-check"
                    disabled={props.isSubmitting}
                  />
                  {returnToListLink}
                </div>
              </div>
            </form>
          );
        }}
      />
    </Panel>
  );
}

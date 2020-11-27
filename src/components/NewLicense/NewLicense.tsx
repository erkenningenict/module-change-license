import React, { useContext } from 'react';
import { Alert } from '@erkenningen/ui/components/alert';
import { Panel, PanelBody } from '@erkenningen/ui/layout/panel';
import { Button } from '@erkenningen/ui/components/button';
import { Spinner } from '@erkenningen/ui/components/spinner';
import { add, isValid } from 'date-fns';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import { number, object, string, date } from 'yup';
import { PersonContext } from '../../shared/PersonContext';
import { FormCalendar, FormSelect, FormText } from '@erkenningen/ui/components/form';
import { useCreateLicenseMutation, useGetListsQuery } from '../../generated/graphql';

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

export function NewLicense(properties: any) {
  const personId = useContext(PersonContext);
  const { loading, data, error } = useGetListsQuery();

  const search = (properties.location && properties.location && properties.location.search) || '';
  const returnToListLink = <Link to={`/licenties${search}`}>Terug</Link>;

  const [
    createLicense,
    { loading: mutationLoading, error: mutationError, data: mutationData },
  ] = useCreateLicenseMutation({

  }
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
        onSubmit={(values: any): void => {
          if (!personId) {
            return;
          }
          const input = {
            personId,
            certificateId: values.certificateId,
            startDate: values.startDate,
            endDate: values.endDate,
            isExtensionOf: values.isExtensionOf,
            remark: values.remark,
          };
          createLicense({ variables: { input } });
        }}
        >
          {(props) => {

        
let certs = data?.Certificaten?.slice(0).sort((a, b) => a.Naam > b.Naam ? 1 : -1)?.map((item) => {
  return {
    value: item.CertificaatID,
    label: item.Naam
  }
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
              >
               
              </FormSelect>
                <FormCalendar
                label="Startdatum"
                name="startDate"
                form={props}
                labelClassNames="col-md-3"
                formControlClassName="col-md-4"
                >

                </FormCalendar>
                <FormCalendar
                label="Einddatum"
                name="endDate"
                form={props}
                labelClassNames="col-md-3"
                formControlClassName="col-md-4"
                >

                </FormCalendar>
                <FormText
               label="Toelichting"
               name="remark"
               onChange={props.handleChange}
               value={props.values.remark}
               
                >

                </FormText>
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
}

import { useMutation, useQuery } from '@apollo/react-hooks';
import { Alert, Panel, PanelBody, Spinner } from '@erkenningen/ui';
import { FormControl, Icon, TextField, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { add, isValid } from 'date-fns';
import { Formik, Field } from 'formik';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { number, object, string, date } from 'yup';
import { CREATE_LICENSE, ICreateLicenseInput } from '../../shared/Mutations';
import { PersonContext } from '../../shared/PersonContext';
import { IListsQuery, LISTS } from '../../shared/Queries';
import FormItem from '../ui/FormItem';
import { KeyboardDatePicker } from '@material-ui/pickers';

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
  const DatePickerField = ({ field, form, ...other }) => {
    return (
      <KeyboardDatePicker
        name={field.name}
        value={field.value}
        format="dd-MM-yyyy"
        cancelLabel="Annuleren"
        showTodayButton={true}
        todayLabel="Vandaag"
        invalidDateMessage={null}
        InputProps={{ disableUnderline: true }}
        // if you are using custom validation schema you probably want to pass `true` as third argument
        onChange={(date: any) => {
          if (field.name === 'startDate' && date !== null) {
            const over5Years = add(date, { years: 5 });
            form.setFieldValue('endDate', over5Years, false);
            // SetTimeout needed because would give end date invalid date error
            setTimeout(() => {
              form.setFieldError('endDate', undefined);
            }, 1);
          }
          return form.setFieldValue(field.name, date, true);
        }}
        {...other}
      />
    );
  };
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
        render={(props): React.ReactNode => {
          return (
            <form onSubmit={props.handleSubmit} className="form form-horizontal" noValidate>
              <FormItem
                label="Certificaat"
                form={props}
                name="certificateId"
                formControlClassName="col-md-3"
              >
                <FormControl fullWidth={true} hiddenLabel={true}>
                  <Select
                    autoWidth={true}
                    name="certificateId"
                    value={props.values.certificateId}
                    onChange={props.handleChange}
                    disableUnderline
                    required
                  >
                    <MenuItem value={0} disabled>
                      Certificaat
                    </MenuItem>
                    {data.Certificaten.sort((a: any, b: any) => (a.Naam > b.Naam ? 1 : -1)).map(
                      (item: any) => (
                        <MenuItem key={item.CertificaatID} value={parseInt(item.CertificaatID, 10)}>
                          {item.Naam}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </FormControl>
              </FormItem>
              <FormItem label="Startdatum" form={props} name="startDate">
                <FormControl fullWidth={true} hiddenLabel={true}></FormControl>
                <Field name="startDate" component={DatePickerField} />
              </FormItem>
              <FormItem label="Einddatum" form={props} name="endDate">
                <FormControl fullWidth={true} hiddenLabel={true}></FormControl>
                <Field name="endDate" component={DatePickerField} />
              </FormItem>
              <FormItem label="Toelichting" form={props} name="remark">
                <FormControl fullWidth={true} hiddenLabel={true}>
                  <TextField
                    name="remark"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.remark}
                    required
                    InputProps={{ disableUnderline: true }}
                    placeholder="Toelichting"
                  />
                </FormControl>
              </FormItem>
              <div className="form-group">
                <div className="col-md-offset-3 col-md-6">
                  <Button
                    color="primary"
                    type="submit"
                    variant="contained"
                    startIcon={<Icon className="fa fa-check" />}
                    disabled={props.isSubmitting}
                  >
                    Licentie aanmaken
                  </Button>
                  <span style={{ marginLeft: '15px' }}>{returnToListLink}</span>
                </div>
              </div>
            </form>
          );
        }}
      />
    </Panel>
  );
}

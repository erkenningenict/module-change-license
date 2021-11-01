import * as yup from 'yup';

export type FormikSchema<T> = {
  [P in keyof T]: [T[P], yup.Schema<any>];
};

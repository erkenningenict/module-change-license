import gql from 'graphql-tag';

export const CREATE_LICENSE = gql`
  mutation createLicense($input: createLicenseInput!) {
    createLicense(input: $input) {
      NummerWeergave
    }
  }
`;

export interface CreateLicenseInput {
  personId: number;
  certificateId: number;
  startDate: any;
  endDate: any;

  /**
   * licenseId that the new license should be based off from
   */
  isExtensionOf: number;
  remark?: string | null;
}

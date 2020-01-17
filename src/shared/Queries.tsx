import gql from 'graphql-tag';

export const GET_MY_ROLES_QUERY = gql`
  query getMy {
    my {
      Roles
    }
  }
`;

export const GET_LICENSES_QUERY = gql`
  query getCertificeringen($personId: Int!) {
    Certificeringen(personId: $personId) {
      CertificeringID
      Certificaat {
        Code
        Naam
      }
      NormVersieID
      BeginDatum
      EindDatum
      Status
      DatumVoldaan
      Opmerkingen
      NummerWeergave
    }
  }
`;

export interface IMy {
  my: {
    Roles: string[];
  };
}

export interface IPerson {
  person: IPersoon;
}

export interface IPersoon {
  __typename: 'Persoon';
  PersoonID: string;
  BSN: string | null;
  Voorletters: string;
  Tussenvoegsel: string;
  Achternaam: string;
  Roepnaam: string;
  Geslacht: string;
  Geboortedatum: any | null;
  Nationaliteit: string;
  Actief: boolean | null;
  IsGbaGeregistreerd: boolean | null;
  GbaNummer: string;
  GbaUpdate: any | null;

  /**
   * Gets the contact data
   */
  Contactgegevens: IContactgegevens;

  /**
   * Fetches all licenses
   */
  Certificeringen: Array<ICertificering | null> | null;
}

export interface IContactgegevens {
  __typename: 'Contactgegevens';
  ContactgegevensID: string;
  Adresregel1: string;
  Adresregel2: string | null;
  Huisnummer: string;
  HuisnummerToevoeging: string | null;
  Postcode: string;
  Woonplaats: string;
  Telefoon: string;
  Land: string;
  Email: string | null;
}

export interface ICertificaat {
  __typename: 'Certificaat';
  CertificaatID: string;
  Code: string;
  Naam: string;
}

export interface ICertificering {
  __typename: 'Certificering';
  CertificeringID: string;
  CertificaatID: number | null;
  NormVersieID: number | null;
  PersoonID: number | null;
  BeginDatum: any | null;
  EindDatum: any | null;
  Opmerkingen: string;
  Nummer: string;
  NummerWeergave: string;
  Status: string;

  /**
   * Datum waarop alle verplichte bijeenkomsten zijn gevolgd
   */
  DatumVoldaan: any | null;
  IsVerlengingVan: number | null;
  DatumAangemaakt: any | null;
  DatumIngetrokkenVan: any | null;
  DatumIngetrokkenTot: any | null;
  UitstelVerleend: boolean | null;
  UitstelTot: any | null;
  Certificaat: ICertificaat;
  CertificeringAantekeningen: Array<ICertificeringAantekening | null> | null;
}

interface ICertificeringAantekening {
  __typename: 'CertificeringAantekening';
  CertificeringID: string;

  /**
   * Can only contain KBA of KBA-GB
   */
  AantekeningCode: string;
  VanafDatum: any;
  DatumPasAangemaakt: any | null;
  Opmerkingen: string | null;
  DatumAangemaakt: any | null;
  DatumGewijzigd: any | null;
  PersoonIDAangemaakt: number | null;
  PersoonIDGewijzigd: number | null;
}

export const LISTS = gql`
  query getLists {
    Certificaten {
      CertificaatID
      Naam
    }
  }
`;

export interface IListsQuery {
  Certificaten: ICertificaat[];
}

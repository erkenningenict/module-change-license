import React from 'react';
import { toDutchDate } from '@erkenningen/ui/utils';

export function LicenseRow(props: any) {
  const { row } = props;
  return (
    <>
      <tr key={row.CertificeringID}>
        <td>TODO</td>
        <td>{row.Certificaat.Code}</td>
        <td>{row.Status}</td>
        <td>{row.NummerWeergave}</td>
        <td className="text-right">{toDutchDate(row.BeginDatum)}</td>
        <td className="text-right">{toDutchDate(row.EindDatum)}</td>
        <td>{row.Opmerkingen}</td>
      </tr>
    </>
  );
}

import React from 'react';

import { useNavigate } from 'react-router-dom';

import { toDutchDate } from '@erkenningen/ui/utils';
import { Button } from '@erkenningen/ui/components/button';
import { useParams } from 'react-router-dom';

export function LicenseRow(props: any) {
  const { personId } = useParams<any>();
  const navigate = useNavigate();
  const { row } = props;

  return (
    <>
      <tr key={row.CertificeringID}>
        <td>
          <Button
            label={''}
            icon="fas fa-id-card"
            onClick={() => {
              navigate(`/${personId}/licenties/${row.CertificeringID}/passen`);
            }}
            style={{ fontSize: '1rem' }}
            tooltip={'Pas details'}
            tooltipOptions={{ position: 'top' }}
          />
        </td>
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

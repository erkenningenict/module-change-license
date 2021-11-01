import { toDutchDate } from '@erkenningen/ui/utils';
import { TableResponsive } from '@erkenningen/ui/layout/table';
import { Panel } from '@erkenningen/ui/layout/panel';
import React from 'react';
import { useStore } from '../../shared/Store';

const PersonDetails: React.FC<{}> = (props) => {
  const store = useStore();

  if (!store.person) {
    return null;
  }

  return (
    <Panel title="Persoon info" doNotIncludeBody={true}>
      <TableResponsive>
        <table className="table table-striped" key="table">
          <thead>
            <tr key="headerRow">
              <th>PersoonID</th>
              <th>Naam</th>
              <th>Geboortedatum</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{store.person?.PersoonID}</td>
              <td>{store.person?.FullName}</td>
              <td>{toDutchDate(store.person?.Geboortedatum)}</td>
            </tr>
          </tbody>
        </table>
      </TableResponsive>
    </Panel>
  );
};

export default PersonDetails;

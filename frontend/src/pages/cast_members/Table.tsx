import { useEffect, useState } from 'react';
import MUITable, { MUIDataTableColumn } from 'mui-datatables';
import { format, parseISO } from 'date-fns';
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';

import { httpVideo } from '../../utils/http';
import { CastMember } from '../../utils/models';

const MEMBER_TYPES: { [key: number]: string | undefined } = {
  1: 'Diretor',
  2: 'Ator/Atriz',
};

const columnsDefinitions: MUIDataTableColumn[] = [
  {
    name: 'id',
    label: 'ID',
  },
  {
    name: 'name',
    label: 'Nome',
  },
  {
    name: 'type',
    label: 'Tipo',
    options: {
      customBodyRender(value) {
        return <span>{MEMBER_TYPES[value] || '--'}</span>;
      },
    },
  },
  {
    name: 'created_at',
    label: 'Criado em',
    options: {
      customBodyRender(value) {
        return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>;
      },
    },
  },
  {
    name: 'actions',
    label: 'Ações',
    options: {
      filter: false,
      sort: false,
      customBodyRender: function CastMemberActions(value, tableMeta) {
        return (
          <span>
            <IconButton
              color="secondary"
              component={Link}
              to={`/cast_members/${tableMeta.rowData[0]}/edit`}
            >
              <EditIcon />
            </IconButton>
          </span>
        );
      },
    },
  },
];

const Table: React.FC = () => {
  const [data, setData] = useState<CastMember[]>([]);
  useEffect(() => {
    httpVideo.get('cast_members').then((response) => {
      setData(response.data.data);
    });
  }, []);
  return (
    <MUITable
      columns={columnsDefinitions}
      title="Membros de elenco"
      data={data}
    />
  );
};

export default Table;

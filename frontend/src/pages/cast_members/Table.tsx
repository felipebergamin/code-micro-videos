import { useEffect, useState } from 'react';
import { MUIDataTableColumn } from 'mui-datatables';
import { format, parseISO } from 'date-fns';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { useSnackbar } from 'notistack';

import castMemberHttp from 'utils/http/cast-member-http';
import DefaultTable, { makeActionStyles } from 'components/Table';
import { CastMember } from 'utils/models';

const MEMBER_TYPES: { [key: number]: string | undefined } = {
  1: 'Diretor',
  2: 'Ator/Atriz',
};

const columnsDefinitions: MUIDataTableColumn[] = [
  {
    name: 'id',
    label: 'ID',
    options: {
      sort: false,
    },
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

const Table = (): JSX.Element => {
  const snackbar = useSnackbar();
  const [data, setData] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    castMemberHttp
      .list()
      .then((response) => {
        setData(response.data.data);
      })
      .catch((err) => {
        console.error(err);
        snackbar.enqueueSnackbar('Não foi possível carregar as informações', {
          variant: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <MuiThemeProvider theme={makeActionStyles(columnsDefinitions.length - 1)}>
      <DefaultTable
        title=""
        columns={columnsDefinitions}
        data={data}
        loading={loading}
      />
    </MuiThemeProvider>
  );
};

export default Table;

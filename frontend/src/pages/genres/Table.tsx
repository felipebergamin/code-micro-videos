import { useEffect, useState } from 'react';
import { MUIDataTableColumn } from 'mui-datatables';
import Chip from '@material-ui/core/Chip';
import { format, parseISO } from 'date-fns';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { useSnackbar } from 'notistack';
import { httpVideo } from '../../utils/http';
import { Genre } from '../../utils/models';
import DefaultTable, { makeActionStyles } from '../../components/Table';

const columnsDefinitions: MUIDataTableColumn[] = [
  {
    name: 'id',
    label: 'ID',
    options: {
      sort: false,
      filter: false,
    },
  },
  {
    name: 'name',
    label: 'Nome',
  },
  {
    name: 'categories',
    label: 'Categorias',
    options: {
      customBodyRender(value) {
        return value.map((category: any) => category.name).join(', ');
      },
    },
  },
  {
    name: 'is_active',
    label: 'Ativo?',
    options: {
      customBodyRender(value) {
        return value ? (
          <Chip label="Sim" color="primary" />
        ) : (
          <Chip label="Não" color="secondary" />
        );
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
      customBodyRender: function GenreActions(value, tableMeta) {
        return (
          <span>
            <IconButton
              color="secondary"
              component={Link}
              to={`/genres/${tableMeta.rowData[0]}/edit`}
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
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Genre[]>([]);
  useEffect(() => {
    setLoading(false);
    httpVideo
      .get('genres')
      .then((response) => {
        setData(response.data.data);
      })
      .catch(() => {
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

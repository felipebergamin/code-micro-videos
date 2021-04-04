import { useEffect, useState } from 'react';
import MUITable, { MUIDataTableColumn } from 'mui-datatables';
import Chip from '@material-ui/core/Chip';
import { format, parseISO } from 'date-fns';

import { httpVideo } from '../../utils/http';

const columnsDefinitions: MUIDataTableColumn[] = [
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
];

const Table: React.FC = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    httpVideo.get('genres').then((response) => {
      setData(response.data.data);
    });
  }, []);
  return (
    <MUITable
      columns={columnsDefinitions}
      title="Gêneros de títulos"
      data={data}
    />
  );
};

export default Table;

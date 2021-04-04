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

// const data = [
//   {
//     name: 'teste',
//     isActive: true,
//     created_at: '2019-12-13',
//   },
//   {
//     name: 'teste2',
//     isActive: true,
//     created_at: '2019-12-14',
//   },
//   {
//     name: 'teste3',
//     isActive: true,
//     created_at: '2019-12-15',
//   },
//   {
//     name: 'teste4',
//     isActive: true,
//     created_at: '2019-12-16',
//   },
// ];

const Table: React.FC = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    httpVideo.get('categories').then((response) => {
      setData(response.data.data);
    });
  }, []);
  return (
    <MUITable
      columns={columnsDefinitions}
      title="Listagem de categorias"
      data={data}
    />
  );
};

export default Table;

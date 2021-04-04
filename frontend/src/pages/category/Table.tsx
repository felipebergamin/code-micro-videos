import { useEffect, useState } from 'react';
import MUITable, { MUIDataTableColumn } from 'mui-datatables';

import { httpVideo } from '../../utils/http';

const columnsDefinitions: MUIDataTableColumn[] = [
  {
    name: 'name',
    label: 'Nome',
  },
  {
    name: 'description',
    label: 'Descrição',
  },
  {
    name: 'created_at',
    label: 'Criado em',
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

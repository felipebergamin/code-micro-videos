import { useEffect, useState } from 'react';
import MUITable, { MUIDataTableColumn } from 'mui-datatables';
import Chip from '@material-ui/core/Chip';
import { format, parseISO } from 'date-fns';

import categoryHttp, { Category } from '../../utils/http/category-http';

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

const Table: React.FC = () => {
  const [tableData, setTableData] = useState<Category[]>([]);
  useEffect(() => {
    categoryHttp.list().then(({ data: { data } }) => setTableData(data));
  }, []);
  return (
    <MUITable
      columns={columnsDefinitions}
      title="Listagem de categorias"
      data={tableData}
    />
  );
};

export default Table;

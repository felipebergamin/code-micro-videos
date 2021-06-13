import { useEffect, useState, useRef } from 'react';
import { MUIDataTableColumn } from 'mui-datatables';
import Chip from '@material-ui/core/Chip';
import { format, parseISO } from 'date-fns';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';

import { useSnackbar } from 'notistack';
import categoryHttp from '../../utils/http/category-http';
import { Category } from '../../utils/models';
import FilterResetButton from '../../components/Table/FilterResetButton';
import DefaultTable, {
  makeActionStyles,
  MuiDataTableRefComponent,
} from '../../components/Table';
import useFilter from '../../hooks/useFilter';

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
    options: {
      filter: false,
    },
  },
  {
    name: 'is_active',
    label: 'Ativo?',
    options: {
      filterOptions: {
        names: ['Sim', 'Não'],
      },
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
      filter: false,
      customBodyRender(value) {
        return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>;
      },
    },
  },
  {
    name: 'actions',
    label: 'Ações',
    options: {
      sort: false,
      filter: false,
      customBodyRender: function CustomBody(value, tableMeta) {
        return (
          <IconButton
            color="secondary"
            component={Link}
            to={`/categories/${tableMeta.rowData[0]}/edit`}
          >
            <EditIcon />
          </IconButton>
        );
      },
    },
  },
];

const debounceTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];

const Table: React.FC = () => {
  const snackbar = useSnackbar();
  const subscribed = useRef(true);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<Category[]>([]);
  const tableRef = useRef() as React.MutableRefObject<MuiDataTableRefComponent>;
  const {
    columns,
    filterManager,
    filterState,
    debouncedFilterState,
    totalRecords,
    setTotalRecords,
  } = useFilter({
    columns: columnsDefinitions,
    debounceTime,
    rowsPerPage,
    rowsPerPageOptions,
    tableRef,
  });

  async function getData() {
    setLoading(true);
    try {
      const { data } = await categoryHttp.list({
        queryParams: {
          search: filterManager.cleanSearchText(debouncedFilterState.search),
          page: debouncedFilterState.pagination.page,
          per_page: debouncedFilterState.pagination.per_page,
          sort: debouncedFilterState.order.sort,
          dir: debouncedFilterState.order.dir,
        },
      });
      if (subscribed.current) {
        setTableData(data.data);
        setTotalRecords(data.meta.total);
      }
    } catch (error) {
      if (categoryHttp.isCancelledRequest(error)) {
        return;
      }
      snackbar.enqueueSnackbar('Não foi possível carregar as informações', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    subscribed.current = true;
    filterManager.pushHistory();
    getData();
    return () => {
      subscribed.current = false;
    };
  }, [
    filterManager.cleanSearchText(debouncedFilterState.search),
    debouncedFilterState.pagination.page,
    debouncedFilterState.pagination.per_page,
    debouncedFilterState.order,
  ]);

  return (
    <MuiThemeProvider theme={makeActionStyles(columnsDefinitions.length - 1)}>
      <DefaultTable
        title=""
        columns={columns}
        data={tableData}
        loading={loading}
        debouncedSearchTime={debouncedSearchTime}
        ref={tableRef}
        options={{
          serverSide: true,
          responsive: 'standard',
          searchText: filterState.search as any,
          page: filterState.pagination.page - 1,
          rowsPerPage: filterState.pagination.per_page,
          rowsPerPageOptions,
          count: totalRecords,
          // eslint-disable-next-line react/display-name
          customToolbar: () => (
            <FilterResetButton
              handleClick={() => filterManager.resetFilter()}
            />
          ),
          onSearchChange: (value) => filterManager.changeSearch(value),
          onChangePage: (page) => filterManager.changePage(page),
          onChangeRowsPerPage: (perPage) =>
            filterManager.changeRowsPerPage(perPage),
          onColumnSortChange: (changedColumn: string, direction: string) =>
            filterManager.changeColumnSort(changedColumn, direction),
        }}
      />
    </MuiThemeProvider>
  );
};

export default Table;

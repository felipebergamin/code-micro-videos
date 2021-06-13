import { useEffect, useRef, useState } from 'react';
import { MUIDataTableColumn } from 'mui-datatables';
import Chip from '@material-ui/core/Chip';
import { format, parseISO } from 'date-fns';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { useSnackbar } from 'notistack';
import * as yup from 'utils/vendor/yup';
import { Genre } from '../../utils/models';
import DefaultTable, {
  makeActionStyles,
  MuiDataTableRefComponent,
} from '../../components/Table';
import categoryHttp from '../../utils/http/category-http';
import genresHttp from '../../utils/http/genres-http';
import FilterResetButton from '../../components/Table/FilterResetButton';
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
    name: 'categories',
    label: 'Categorias',
    options: {
      filterType: 'multiselect',
      filterOptions: {
        names: [],
      },
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

const debounceTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];
const Table: React.FC = () => {
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Genre[]>([]);
  const subscribed = useRef(true);
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
    extraFilter: {
      createValidationSchema: () => {
        return yup.object().shape({
          categories: yup
            .mixed()
            .nullable()
            .transform((value) => {
              return !value || value === '' ? undefined : value.split(',');
            })
            .default(null),
        });
      },
      formatSearchParams: (debouncedState) => {
        return debouncedState.extraFilter
          ? {
              ...(debouncedState.extraFilter.categories && {
                categories: debouncedState.extraFilter.categories.join(','),
              }),
            }
          : undefined;
      },
      getStateFromURL: (queryParams) => {
        return {
          categories: queryParams.get('categories'),
        };
      },
    },
  });

  const indexColumnCategories = columns.findIndex(
    (c) => c.name === 'categories',
  );
  const columnCategories = columns[indexColumnCategories];
  const categoriesFilterValue =
    filterState.extraFilter && filterState.extraFilter.categories;
  (columnCategories.options as any).filterList = categoriesFilterValue || [];
  const serverSideFilterList = columns.map(() => []);
  if (categoriesFilterValue) {
    serverSideFilterList[indexColumnCategories] = categoriesFilterValue;
  }
  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      try {
        const { data: response } = await categoryHttp.list({
          queryParams: { all: '' },
        });
        if (isSubscribed) {
          // setCategories(response.data);
          (columnCategories.options as any).filterOptions.names = response.data.map(
            (category) => category.name,
          );
        }
      } catch (error) {
        snackbar.enqueueSnackbar('Não foi possível carregar as informações', {
          variant: 'error',
        });
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, []);
  async function getData() {
    setLoading(true);
    try {
      const { data: response } = await genresHttp.list({
        queryParams: {
          search: filterManager.cleanSearchText(debouncedFilterState.search),
          page: debouncedFilterState.pagination.page,
          per_page: debouncedFilterState.pagination.per_page,
          sort: debouncedFilterState.order.sort,
          dir: debouncedFilterState.order.dir,
          ...(debouncedFilterState.extraFilter &&
            debouncedFilterState.extraFilter.categories && {
              categories: debouncedFilterState.extraFilter.categories.join(','),
            }),
        },
      });
      if (subscribed.current) {
        setData(response.data);
        setTotalRecords(response.meta.total);
      }
    } catch (error) {
      if (genresHttp.isCancelledRequest(error)) {
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
    JSON.stringify(debouncedFilterState.extraFilter),
  ]);
  return (
    <MuiThemeProvider theme={makeActionStyles(columnsDefinitions.length - 1)}>
      <DefaultTable
        title=""
        columns={columns}
        data={data}
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
          onFilterChange: (column, filterList) => {
            const columnIndex = columns.findIndex((c) => c.name === column);
            filterManager.changeExtraFilter({
              [column as string]: filterList[columnIndex].length
                ? filterList[columnIndex]
                : null,
            });
          },
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

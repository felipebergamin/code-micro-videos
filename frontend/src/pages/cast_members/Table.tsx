import { useEffect, useRef, useState } from 'react';
import { MUIDataTableColumn } from 'mui-datatables';
import { format, parseISO } from 'date-fns';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { useSnackbar } from 'notistack';
import { invert } from 'lodash';

import castMemberHttp from 'utils/http/cast-member-http';
import DefaultTable, {
  makeActionStyles,
  MuiDataTableRefComponent,
} from 'components/Table';
import { CastMember, CastMemberTypeMap } from 'utils/models';
import FilterResetButton from 'components/Table/FilterResetButton';

import * as yup from 'utils/vendor/yup';
import useFilter from 'hooks/useFilter';

const castMemberNames = Object.values(CastMemberTypeMap);

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
    name: 'type',
    label: 'Tipo',
    options: {
      filterOptions: {
        names: castMemberNames as string[],
      },
      customBodyRender(value) {
        return <span>{MEMBER_TYPES[value] || '--'}</span>;
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

const debounceTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];
const Table = (): JSX.Element => {
  const snackbar = useSnackbar();
  const subscribed = useRef(true);
  const [data, setData] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
          type: yup
            .string()
            .nullable()
            .transform((value) => {
              return !value || !castMemberNames.includes(value)
                ? undefined
                : value;
            })
            .default(null),
        });
      },
      formatSearchParams: (debouncedState) => {
        return debouncedState.extraFilter
          ? {
              ...(debouncedState.extraFilter.type && {
                type: debouncedState.extraFilter.type,
              }),
            }
          : undefined;
      },
      getStateFromURL: (queryParams) => {
        return {
          type: queryParams.get('type'),
        };
      },
    },
  });
  const indexColumnType = columns.findIndex((c) => c.name === 'type');
  const columnType = columns[indexColumnType];
  const typeFilterValue =
    filterState.extraFilter && (filterState.extraFilter.type as never);
  (columnType.options as any).filterList = typeFilterValue
    ? [typeFilterValue]
    : [];

  const serverSideFilterList = columns.map(() => []);
  if (typeFilterValue) {
    serverSideFilterList[indexColumnType] = [typeFilterValue];
  }

  async function getData() {
    setLoading(true);
    try {
      const { data: result } = await castMemberHttp.list({
        queryParams: {
          search: filterManager.cleanSearchText(debouncedFilterState.search),
          page: debouncedFilterState.pagination.page,
          per_page: debouncedFilterState.pagination.per_page,
          sort: debouncedFilterState.order.sort,
          dir: debouncedFilterState.order.dir,
          ...(debouncedFilterState.extraFilter &&
            debouncedFilterState.extraFilter.type && {
              type: invert(CastMemberTypeMap)[
                debouncedFilterState.extraFilter.type
              ],
            }),
        },
      });
      if (subscribed.current) {
        setData(result.data);
        setTotalRecords(result.meta.total);
      }
    } catch (error) {
      if (castMemberHttp.isCancelledRequest(error)) {
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
                ? filterList[columnIndex][0]
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

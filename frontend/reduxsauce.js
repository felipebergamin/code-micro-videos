// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createActions } = require('reduxsauce');

createActions({
  setSearch: ['payload'],
  setPage: ['payload'],
  setPerPage: ['payload'],
  setOrder: ['payload'],
});

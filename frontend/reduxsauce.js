const { createActions } = require('reduxsauce');

const { Types, Creators } = createActions({
  setSearch: ['payload'],
  setPage: ['payload'],
  setPerPage: ['payload'],
  setOrder: ['payload'],
});

console.log(Types, Creators);
console.log(Creators.setSearch({ search: 'teste' }));

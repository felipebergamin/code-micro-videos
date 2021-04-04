import { Box, Fab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';

import Page from '../../components/Page';
import Table from './Table';

// import { Container } from './styles';

const StaffList: React.FC = () => {
  return (
    <Page title="Listar categorias">
      <Box dir="rtl">
        <Fab
          title="Adicionar categoria"
          size="small"
          component={Link}
          to="/categories/create"
        >
          <AddIcon />
        </Fab>
      </Box>
      <Box>
        <Table />
      </Box>
    </Page>
  );
};

export default StaffList;
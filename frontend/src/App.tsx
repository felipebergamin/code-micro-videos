import { Box } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumb';

import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';
import SnackbarProvider from './components/SnackbarProvider';

function App(): JSX.Element {
  return (
    <SnackbarProvider>
      <BrowserRouter>
        <Navbar />
        <Box paddingTop="80px">
          <Breadcrumbs />
          <AppRouter />
        </Box>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;

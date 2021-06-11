import { Box, MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';

import Breadcrumbs from './components/Breadcrumb';
import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';
import SnackbarProvider from './components/SnackbarProvider';
import theme from './theme';

function App(): JSX.Element {
  return (
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider>
        <BrowserRouter>
          <Navbar />
          <Box paddingTop="80px">
            <Breadcrumbs />
            <AppRouter />
          </Box>
        </BrowserRouter>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
}

export default App;

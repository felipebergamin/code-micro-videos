import { Box } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';

import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Box paddingTop="80px">
          <AppRouter />
        </Box>
      </BrowserRouter>
    </>
  );
}

export default App;

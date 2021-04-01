import { Box } from '@material-ui/core';

import Navbar from './components/Navbar';
import Page from './components/Page';

function App() {
  return (
    <>
      <Navbar />
      <Box paddingTop="80px">
        <Page title="Category">
          Conteúdo
        </Page>
      </Box>
    </>
  );
}

export default App;

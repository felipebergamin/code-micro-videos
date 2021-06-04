import { useParams } from 'react-router';

import Page from '../../components/Page';
import Form from './Form';

export interface PageFormParams {
  id: string | undefined;
}

const PageForm = (): JSX.Element => {
  const { id } = useParams<PageFormParams>();
  return (
    <Page title={id ? 'Editar categoria' : 'Criar categoria'}>
      <Form />
    </Page>
  );
};

export default PageForm;

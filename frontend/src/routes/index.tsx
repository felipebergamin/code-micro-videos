import { RouteProps } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import CategoryList from '../pages/category/PageList';
import CategoryCreate from '../pages/category/PageForm';
import CastMembersList from '../pages/cast_members/PageList';
import GenresList from '../pages/genres/PageList';

export interface MyRouteProps extends RouteProps {
  label: string;
  name: string;
}

const routes: MyRouteProps[] = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    path: '/',
    component: Dashboard,
    exact: true,
  },
  {
    name: 'categories.list',
    label: 'Listar Categorias',
    path: '/categories',
    component: CategoryList,
    exact: true,
  },
  {
    name: 'categories.create',
    label: 'Criar Categoria',
    path: '/categories/create',
    component: CategoryCreate,
    exact: true,
  },
  {
    name: 'cast_members.list',
    label: 'Membros de elenco',
    path: '/cast_membrs/list',
    component: CastMembersList,
  },
  {
    name: 'genres.list',
    label: 'Gêneros de títulos',
    path: '/genres/list',
    component: GenresList,
  },
];

export default routes;

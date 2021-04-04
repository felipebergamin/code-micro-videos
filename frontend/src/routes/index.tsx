import { RouteProps } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import CategoryList from '../pages/category/PageList';
import CastMembersList from '../pages/cast_members/PageList';

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
    component: CategoryList,
    exact: true,
  },
  {
    name: 'cast_members.list',
    label: 'Membros de elenco',
    path: '/cast_membrs/list',
    component: CastMembersList,
  },
];

export default routes;

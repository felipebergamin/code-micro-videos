import { RouteProps } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import CategoryList from '../pages/category/PageList';
import CategoryForm from '../pages/category/PageForm';
import CastMembersList from '../pages/cast_members/PageList';
import CastMemberForm from '../pages/cast_members/PageForm';
import GenresList from '../pages/genres/PageList';
import GenresForm from '../pages/genres/PageForm';

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
    component: CategoryForm,
    exact: true,
  },
  {
    name: 'categories.edit',
    label: 'Editar Categoria',
    path: '/categories/:id/edit',
    component: CategoryForm,
    exact: true,
  },
  {
    name: 'cast_members.list',
    label: 'Membros de elenco',
    path: '/cast_members/list',
    component: CastMembersList,
  },
  {
    name: 'cast_members.create',
    label: 'Adicionar membro de elenco',
    path: '/cast_members/create',
    component: CastMemberForm,
  },
  {
    name: 'cast_members.edit',
    label: 'Editar membro de elenco',
    path: '/cast_members/:id/edit',
    component: CastMemberForm,
    exact: true,
  },
  {
    name: 'genres.list',
    label: 'Gêneros de títulos',
    path: '/genres/list',
    component: GenresList,
  },
  {
    name: 'genres.create',
    label: 'Adicionar novo gênero',
    path: '/genres/create',
    component: GenresForm,
  },
  {
    name: 'genres.edit',
    label: 'Editar gênero',
    path: '/genres/:id/edit',
    component: GenresForm,
  },
];

export default routes;

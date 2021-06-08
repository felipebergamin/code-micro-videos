import { httpVideo } from '.';
import HttpResource from './http-resource';
import { Category } from './category-http';

export type Genre = {
  id: string;
  name: string;
  // eslint-disable-next-line camelcase
  is_active: boolean;
  categories?: Category[];
};

const genresHttp = new HttpResource<Genre>(httpVideo, 'genres');

export default genresHttp;

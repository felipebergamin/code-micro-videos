import { httpVideo } from '.';
import HttpResource from './http-resource';

export type Genre = {
  id: string;
  name: string;
  // eslint-disable-next-line camelcase
  is_active: boolean;
};

const genresHttp = new HttpResource<Genre>(httpVideo, 'genres');

export default genresHttp;

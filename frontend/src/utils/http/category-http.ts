import { httpVideo } from '.';
import HttpResource from './http-resource';

export type Category = {
  id: string;
  name: string;
};

const categoryHttp = new HttpResource<Category>(httpVideo, 'categories');

export default categoryHttp;

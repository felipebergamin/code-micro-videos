import { httpVideo } from '.';
import HttpResource from './http-resource';
import { Category } from '../models';

const categoryHttp = new HttpResource<Category>(httpVideo, 'categories');

export default categoryHttp;

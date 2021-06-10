import { httpVideo } from '.';
import HttpResource from './http-resource';
import { Genre } from '../models';

const genresHttp = new HttpResource<Genre>(httpVideo, 'genres');

export default genresHttp;

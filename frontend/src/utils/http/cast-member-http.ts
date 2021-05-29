import { httpVideo } from '.';
import HttpResource from './http-resource';

export type CastMember = {
  id: string;
  name: string;
  type: 1 | 2;
};

const categoryHttp = new HttpResource<CastMember>(httpVideo, 'cast_members');

export default categoryHttp;

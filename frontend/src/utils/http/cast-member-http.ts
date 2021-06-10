import { httpVideo } from '.';
import HttpResource from './http-resource';
import { CastMember } from '../models';

const categoryHttp = new HttpResource<CastMember>(httpVideo, 'cast_members');

export default categoryHttp;

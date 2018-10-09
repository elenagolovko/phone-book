import sessionCreate from './session/sessionCreate';

import geolocationGet from './geolocation/geolocationGet';

import naviCreate from './address/naviCreate';
import naviDelete from './address/naviDelete';

import naviGetOwn from './addresses/naviGetOwn';
import naviGetFavorites from './addresses/naviGetFavorites';

export { default as sessionCreate } from './session/sessionCreate';
export { default as geolocationGet } from './geolocation/geolocationGet';
export { default as naviCreate } from './address/naviCreate';
export { default as naviDelete } from './address/naviDelete';
export { default as naviGetOwn } from './addresses/naviGetOwn';
export { default as naviGetFavorites } from './addresses/naviGetFavorites';

export default {
  sessionCreate,
  geolocationGet,
  naviCreate,
  naviDelete,
  naviGetOwn,
  naviGetFavorites
};

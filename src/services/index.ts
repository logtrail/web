import Axios, { AxiosRequestConfig } from 'axios';

// --------------- //
// SERVICE MODULES //
// --------------- //
import { categoriesModule } from './categories';
import { logsModule } from './logs';
import { managementModule } from './management';
import { notificationsModule } from './notifications';
import { searchSchemasModule } from './searchSchemas';

// ----------------- //
// ENVS FOR SERVICES //
// ----------------- //

const baseURL = process?.env?.SERVER_URI
  ? process?.env?.SERVER_URI
  : 'https://7a03-2804-1b0-1403-394c-af33-699e-7f70-fadf.sa.ngrok.io/v1';

/**
 * client http
 */
const clientHttp = Axios.create({ baseURL });

/**
 * Interceptors HTTP
 */
clientHttp.interceptors.request.use((request: AxiosRequestConfig) => {
  const tokenJwt = 'My token';
  request.headers.common.Authorization = tokenJwt;
  request.headers.common['ngrok-skip-browser-warning'] = true;

  return request;
});

/**
 * In near future we go implement JWT, we will used this function bellow to refresh if error is 401
 */
// clientHttp.interceptors.response

/**
 * Export modules for service
 */
export const services = {
  categories: categoriesModule.apply(clientHttp),
  logs: logsModule.apply(clientHttp),
  management: managementModule.apply(clientHttp),
  notifications: notificationsModule.apply(clientHttp),
  searchSchemas: searchSchemasModule.apply(clientHttp),
};

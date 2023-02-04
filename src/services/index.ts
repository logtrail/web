import Axios, { AxiosRequestConfig } from 'axios';

// --------------- //
// SERVICE MODULES //
// --------------- //
import { notificationModule } from './notifications';

// ----------------- //
// ENVS FOR SERVICES //
// ----------------- //

const baseURL = process?.env?.SERVER_URI
  ? process?.env?.SERVER_URI
  : 'http://localhost:3005/v1';

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
  notification: notificationModule.apply(clientHttp),
};

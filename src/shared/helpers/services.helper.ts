import { AxiosResponse } from 'axios';

/**
 * Axios response
 * @param axiosResponse: AxiosResponse - Http response
 */
export function getData(axiosResponse: AxiosResponse) {
  const { data: { data } } = axiosResponse;
  return data;
}

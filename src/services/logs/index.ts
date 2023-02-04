import { omitBy, isEmpty } from 'lodash';
import { getData } from 'src/shared/helpers';

import { Find } from './interfaces';
import { BASE_URL } from './constants';

/**
 * Find notifications
 * @param payload: Find - Params to find notifications
 */
async function find(payload: Find) {
  // @ts-ignore
  const retData = await this.post(`${BASE_URL}/search`, payload);
  return getData(retData);
}

/**
 * Methods to management the logs
 */
export function logsModule(this: any) {
  return {
    search: find.bind(this),
  };
}

import { omitBy, isEmpty } from 'lodash';
import { getData } from 'src/shared/helpers';

import { Find } from './interfaces';
import { BASE_URL } from './constants';

/**
 * Find notifications
 * @param queryParams: Find - Params to find notifications
 */
async function find(queryParams: Find) {
  const query = new URLSearchParams({ ...omitBy(queryParams, isEmpty) });
  let url = BASE_URL;

  if (!isEmpty(query)) url = `${url}?${query}`;

  // @ts-ignore
  const retData = await this.get(url);
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

import { omitBy, isEmpty } from 'lodash';
import { SearchSchema } from 'src/shared/interfaces';
import { getData } from 'src/shared/helpers';

import { Find } from './interfaces';
import { BASE_URL } from './constants';

/**
 * Create a new searchSchema
 * @param payload: searchSchema - Payload to create new searchSchema
 */
async function create(payload: SearchSchema) {
  // @ts-ignore
  const retData = await this.post(BASE_URL, payload);
  return getData(retData);
}

/**
 * Find searchSchemas
 * @param queryParams: Find - Params to find searchSchemas
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
 * Update a searchSchema by searchSchema id
 * @param payload: searchSchema - Payload to update a new searchSchema
 */
async function updateById(id: string, payload: Partial<SearchSchema>) {
  // @ts-ignore
  const retData = await this.patch(`${BASE_URL}/${id}`, payload);
  return getData(retData);
}

/**
 * Find a searchSchema by id
 * @param id: string - searchSchema id
 * @param projection: string - projection to get some fields
 */
async function findById(id: string, projection?: string) {
  let url = `${BASE_URL}/${id}`;
  if (projection) url = `${url}?projection=${projection}`;

  // @ts-ignore
  const retData = await this.get(url);
  return getData(retData);
}

/**
 * Delete a searchSchema by id
 * @param id: string - searchSchema id
 * @param projection: string - projection to get some fields
 */
async function deleteById(id: string, projection?: string) {
  // @ts-ignore
  const retData = await this.delete(`${BASE_URL}/${id}`);
  return getData(retData);
}

/**
 * Methos to management the searchSchemas
 */
export function searchSchemasModule(this: any) {
  return {
    create: create.bind(this),
    find: find.bind(this),
    updateById: updateById.bind(this),
    findById: findById.bind(this),
    deleteById: deleteById.bind(this),
  };
}

import { omitBy, isEmpty } from 'lodash';
import { Category } from 'src/shared/interfaces';
import { getData } from 'src/shared/helpers';

import { Find } from './interfaces';
import { BASE_URL } from './constants';

/**
 * Create a new category
 * @param payload: Category - Payload to create new category
 */
async function create(payload: Category) {
  // @ts-ignore
  const retData = await this.post(BASE_URL, payload);
  return getData(retData);
}

/**
 * Find categories
 * @param queryParams: Find - Params to find categories
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
 * Update a category by category id
 * @param payload: Category - Payload to update a new category
 */
async function updateById(id: string, payload: Partial<Category>) {
  // @ts-ignore
  const retData = await this.path(`${BASE_URL}/${id}`, payload);
  return getData(retData);
}

/**
 * Find a category by id
 * @param id: string - Category id
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
 * Delete a category by id
 * @param id: string - Category id
 * @param projection: string - projection to get some fields
 */
async function deleteById(id: string, projection?: string) {
  // @ts-ignore
  const retData = await this.delete(`${BASE_URL}/${id}`);
  return getData(retData);
}

/**
 * Methods to management the categories
 */
export function categoriesModule(this: any) {
  return {
    create: create.bind(this),
    find: find.bind(this),
    updateById: updateById.bind(this),
    findById: findById.bind(this),
    deleteById: deleteById.bind(this),
  };
}

import { omitBy, isEmpty } from 'lodash';
import { Notification } from 'src/shared/interfaces';
import { getData } from 'src/shared/helpers';

import { Find } from './interfaces';
import { BASE_URL } from './constants';

/**
 * Create a new notification
 * @param payload: Notification - Payload to create new notification
 */
async function create(payload: Notification) {
  // @ts-ignore
  const retData = await this.post(BASE_URL, payload);
  return getData(retData);
}

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
 * Update a notification by notification id
 * @param payload: Notification - Payload to update a new notification
 */
async function updateById(id: string, payload: Partial<Notification>) {
  // @ts-ignore
  const retData = await this.path(`${BASE_URL}/${id}`, payload);
  return getData(retData);
}

/**
 * Find a notification by id
 * @param id: string - Notification id
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
 * Delete a notification by id
 * @param id: string - Notification id
 * @param projection: string - projection to get some fields
 */
async function deleteById(id: string, projection?: string) {
  // @ts-ignore
  const retData = await this.delete(`${BASE_URL}/${id}`);
  return getData(retData);
}

/**
 * Methos to management the notifications
 */
export function notificationsModule(this: any) {
  return {
    create: create.bind(this),
    find: find.bind(this),
    updateById: updateById.bind(this),
    findById: findById.bind(this),
    deleteById: deleteById.bind(this),
  };
}

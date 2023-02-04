import { getData } from 'src/shared/helpers';
import { BASE_URL } from './constants';

/**
 * Get collection logs status
 */
async function statusCollection() {
  // @ts-ignore
  const retData = await this.get(`${BASE_URL}/status`);
  return getData(retData);
}

/**
 * Resize collection.
 * This feature only to work in mongo version >= 6.0
 */
async function resizeCollection(size: number) {
  // @ts-ignore
  const retData = await this.path(`${BASE_URL}/resize`, { size });
  return getData(retData);
}

/**
 * Methos to management the notifications
 */
export function managementModule(this: any) {
  return {
    statusCollection: statusCollection.bind(this),
    resizeCollection: resizeCollection.bind(this),
  };
}

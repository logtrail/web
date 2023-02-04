import { getData } from 'src/shared/helpers';
import { BASE_URL } from './constants';

/**
 * Get collection logs status
 */
async function collectionStatus() {
  // @ts-ignore
  const retData = await this.get(`${BASE_URL}/status`);
  return getData(retData);
}

/**
 * Resize collection.
 * This feature only to work in mongo version >= 6.0
 */
async function collectionResize(size: number) {
  // @ts-ignore
  const retData = await this.path(`${BASE_URL}/resize`, { size });
  return getData(retData);
}

/**
 * Methos to management the notifications
 */
export function managementModule(this: any) {
  return {
    collectionStatus: collectionStatus.bind(this),
    collectionResize: collectionResize.bind(this),
  };
}

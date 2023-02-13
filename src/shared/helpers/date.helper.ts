import dayjs from 'dayjs';

/**
 * Format date
 * @param date: Date - Date to format
 * @param format: string - Format type
 */
export function formatDate(date: Date, format: string) {
  return dayjs(date).format(format);
}

/**
 * Get timestamp by mongo id (_id)
 * @param _id: string - Mongo id
 */
export const mongoIdToTimeStamp = (_id: string) => (
  new Date(parseInt(_id.substring(0, 8), 16) * 1000).valueOf()
);

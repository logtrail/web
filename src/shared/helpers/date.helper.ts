import dayjs from 'dayjs';

/**
 * Format date
 * @param date: Date - Date to format
 * @param format: string - Format type
 */
export function formatDate(date: Date, format: string) {
  return dayjs(date).format(format);
}

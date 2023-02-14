/**
 * Find notifications
 */
export interface Find {
  name?: string;
  logTypeId?: string;
  level?: string;
  page?: number;
  perPage?: number;
  projection?: string;
}

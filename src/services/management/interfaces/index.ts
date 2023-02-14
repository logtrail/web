/**
 * Find notifications
 */
export interface Find {
  name?: string;
  type?: string;
  page?: number;
  perPage?: number;
  projection?: string;
}

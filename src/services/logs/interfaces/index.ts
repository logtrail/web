/**
 * Filter can use
 */
export interface FieldFilters {
  bucketName: string;
  operation?: string | string[];
  field: string;
  value?: any;
}

/**
 * Find logs
 */
export interface Find {
  limit?: number;
  nextCursor?: string;
  previousCursor?: string;
  level?: string;
  categories?: string[];
  created: {
    start: string;
    end: string;
  };
  filters?: FieldFilters[];
}

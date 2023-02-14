/**
 * Maps to create the filters to search
 */
export interface SearchSchemaMaps {
  from: string | string[];
  to: string;
  type: string;
  valueTransformation?: Record<any, any>;
}

/**
 * Search schema
 */
export interface SearchSchema {
  name: string;
  fields: SearchSchemaMaps[];
}

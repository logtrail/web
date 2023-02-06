import { QSelectOption } from 'quasar'

/**
 * Operation options
 */
export interface OperationOptions {
  numbersBucket?: QSelectOption[],
  stringsBucket?: QSelectOption[],
  booleansBucket?: QSelectOption[]
}

/**
 * Field name
 */
export interface FieldName extends QSelectOption {
  value: string;
  id: string;
  categoryId?: string;
}

/**
 * Item search scheme
 */
export interface ItemSearchScheme {
  from: string | string[];
  to: string;
  type: string;
}

/**
 * Search scheme
 */
export interface SearchScheme extends QSelectOption<ItemSearchScheme[]> {}

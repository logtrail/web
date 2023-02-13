export interface FieldType {
  from: string|string[],
  fromType: 'string' | 'number' | 'boolean',
  to: string
  type: 'stringsBucket' | 'numbersBucket' | 'booleansBucket',
}

export interface SearchSchemeData {
  name: string;
  fields: string[];
  _id: string;
  created?: string;
  modified?: string;
}

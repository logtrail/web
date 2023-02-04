export type ColumnTypes = {
  field: string | ((row: any) => any);
  label: string;
  name: string,

  align?: 'left' | 'right' | 'center';
  classes?: string | ((row: any) => string);
  format?: (val: any, row: any) => any;
  headerStyle?: string;
  headerClasses?: string;
  required?: boolean;
  sortable?: boolean;
  sort?: (a: any, b: any, rowA: any, rowB: any) => number;
  sortOrder?: 'ad' | 'da';
  style?: string | ((row: any) => string);
};
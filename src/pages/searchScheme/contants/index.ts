import { QTableColumn } from 'quasar';

/**
 * Columns list search scheme
 */
export const COLUMNS: QTableColumn[] = [
  {
    name: 'name',
    label: 'Search scheme',
    field: 'name',
    align: 'left',
  },
  {
    name: 'fields',
    label: 'Fields',
    field: 'fields',
    align: 'left',
    format: (val) => `${val.length} field${val.length > 1 ? 's' : ''}`,
  },
  {
    name: 'created',
    align: 'left',
    label: 'Created At',
    field: 'created',
  },
  {
    name: 'actions',
    align: 'right',
    label: 'Actions',
    field: 'actions',
  },
];

/**
 * Default state
 */
export const DEFAULT_STATE = {
  _id: '',
  name: '',
  fields: [],
};

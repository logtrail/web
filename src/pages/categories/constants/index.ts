import { QTableColumn } from 'quasar';

/**
 * Columnn table categories list
 */
export const COLUMNS: QTableColumn[] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'level',
    align: 'left',
    label: 'Level',
    field: 'level',
  },
  {
    name: 'logType',
    align: 'left',
    label: 'Search scheme',
    field: 'logType',
  },
  {
    name: 'notifications',
    align: 'left',
    label: 'Notifications',
    field: 'notifications',
  },
  {
    name: 'created',
    align: 'left',
    label: 'Creat at',
    field: 'created',
  },
  {
    name: 'actions',
    align: 'right',
    label: 'Actions',
    field: 'actions',
  },
];

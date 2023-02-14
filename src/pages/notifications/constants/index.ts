import { QTableColumn } from 'quasar';

/**
 * Column table categories list
 */
export const COLUMNS: QTableColumn[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'type',
    align: 'left',
    label: 'Type',
    field: 'type',
  },
  {
    name: 'notificationAccount',
    align: 'left',
    label: 'Notification account',
    field: (row: any) => row.options.user,
  },
  {
    name: 'enable',
    align: 'left',
    label: 'Status',
    field: 'enable',
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
  type: 'email',
  enable: true,
  name: '',
  options: {},
};

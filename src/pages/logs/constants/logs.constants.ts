/**
 * Columns log tables
 */
export const COLUMNS = [
  {
    name: 'event',
    required: true,
    label: 'Event',
    field: 'event',
    align: 'left',
  },
  {
    name: 'level',
    align: 'left',
    label: 'Level',
    field: 'level',
  },
  {
    name: 'category',
    align: 'left',
    label: 'Category',
    field: 'category',
  },
  {
    name: 'created',
    align: 'right',
    label: 'Created at',
    field: 'created',
  },
];

/**
 * Advanced filter kind number
 */
export const NUMBER_OPERATIONS = [
  { label: 'Less than', value: 'lt' },
  { label: 'Less then or equal', value: 'lte' },
  { label: 'Greater than', value: 'gt' },
  { label: 'Greater than or equal', value: 'gte' },
];

/**
 * Advanced filter kind boolean
 */
export const BOOLEAN_VALUES = [
  { label: 'True', value: true },
  { label: 'False', value: false },
];

/**
 * All operation can use in advanced filter
 */
export const ALL_OPERATIONS = {
  numbersBucket: [
    { label: 'Range', value: 'range' },
    { label: 'Equal', value: 'equal' },
  ],
  stringsBucket: [
    { label: 'Contain', value: 'contain' },
    { label: 'Not contain', value: 'notContain' },
    { label: 'Start with', value: 'startWith' },
    { label: 'Equal', value: 'equal' },
  ],
  booleansBucket: [
    { label: 'Contain', value: 'contain' },
    { label: 'Not contain', value: 'notContain' },
  ],
};

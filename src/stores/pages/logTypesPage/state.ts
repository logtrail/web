import { defineStore } from 'pinia';

import LogTypesState from './types/logTypesState.type';

export const useState = defineStore({
  id: 'logTypes.state',

  state: (): LogTypesState => ({
    addingLogType: false,
    editingLogType: false,

    newLogType: {},
    logTypesList: [],
  }),
});

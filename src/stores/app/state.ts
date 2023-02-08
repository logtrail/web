import { defineStore } from 'pinia';

import { AppState } from './interface/appState.interface';

export const useState = defineStore({
  id: 'app.state',

  state: (): AppState => ({
    drawerMenu: [],
  }),
});

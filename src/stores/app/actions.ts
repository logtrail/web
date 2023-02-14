import { defineStore } from 'pinia';

import { useState } from './state';

export const useActions = defineStore('app.actions', () => {
  const state = useState();

  function clearData(): void {
    state.$reset();
  }

  return {
    clearData,
  };
});

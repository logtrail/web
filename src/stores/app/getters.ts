import { defineStore } from 'pinia';

import { computed } from 'vue';
import { useState } from './state';

export const useGetters = defineStore('app.getters', () => {
  const state = useState();

  return {
  };
});

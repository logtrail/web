import { defineStore } from 'pinia';

import { extractStore } from 'stores/extractStore';
import { useState } from './state';
import { useActions } from './actions';
import { useGetters } from './getters';

export default defineStore('app', () => ({
  ...extractStore(useState()),
  ...extractStore(useGetters()),
  ...extractStore(useActions()),
}));

<template>
  <div class="search-result-card row full-width">
    <div
      v-for="currentSearchScheme of allSearchSchemes"
      class="search-result-card_item row col-12 justify-between cursor-pointer"
      :class="$q.screen.lt.md ? 'q-col-gutter-y-md' : ''"
      :id="`search-scheme-${currentSearchScheme._id}`"
      :key="`search-scheme-${currentSearchScheme._id}`"
      @click.stop="expandSearchSchemeItem(currentSearchScheme._id)">
      <div class="row col-12 col-md-3 q-pr-xs content-start">
        <span class="col-12 field-title">Name</span>
        <span class="col-12">
          {{ currentSearchScheme.name }}
        </span>
      </div>

      <div class="row col-12 col-md-3 q-px-xs content-start">
        <span class="col-12 field-title">
          Fields
        </span>
        <span class="col-12">
          {{ getFieldsLabel(currentSearchScheme.fields) }}
        </span>
      </div>

      <div
        class="row col-12 col-md-3 q-pl-xs content-start"
        :class="$q.screen.lt.md ? '' : 'text-right'">
        <span class="col-12 field-title">
          Created at
        </span>
        <span class="col-12">
          {{ formatDate(currentSearchScheme.created, 'YYYY/MM/DD HH:mm:ss') }}
        </span>
      </div>

      <div class="row col-12 col-md-3 q-pl-xs content-center">
        <!-- <span class="col-12 field-title">
          Actions
        </span> -->
        <div
          class="col-12 row"
          :class="$q.screen.lt.md ? '' : 'justify-end'">
          <q-btn
            dense
            round
            unelevated
            class="q-mr-xs"
            color="blue"
            @click.stop="editSearchScheme(currentSearchScheme._id)">
            <q-icon
              name="edit"
              color="white"
              size="18px"/>
          </q-btn>

          <q-btn
            dense
            round
            unelevated
            class="q-ml-xs"
            color="red-5"
            @click.stop="removeSearchScheme(currentSearchScheme._id)">
            <q-icon
              name="delete"
              color="white"
              size="18px"/>
          </q-btn>
        </div>
      </div>

      <div
        class="full-width row search-scheme-details"
        @click.stop="() => ''">
        <q-separator class="q-my-md full-width" />
        <div class="text-left col-12">
          <p class="text-h6">Search scheme details</p>
          <!-- eslint-disable-next-line max-len -->
          <pre class="language-javascript"><code>{{ accountDetails(currentSearchScheme) }}</code></pre>
        </div>
      </div>

      <q-menu
        touch-position
        context-menu>
        <q-list style="min-width: 80px">
          <q-item
            v-close-popup
            clickable
            @click="expandSearchSchemeItem(currentSearchScheme._id)">
            <q-item-section avatar>
              <q-icon name="unfold_less" />
            </q-item-section>
            <q-item-section>Toggle search schema details</q-item-section>
          </q-item>

          <q-separator />

          <q-item
            v-close-popup
            clickable
            @click="copySearchSchema(currentSearchScheme)">
            <q-item-section avatar>
              <q-icon name="copy_all" />
            </q-item-section>
            <q-item-section>Copy search schema</q-item-section>
          </q-item>

          <q-item
            v-close-popup
            clickable
            @click="copyDataToClipboard(currentSearchScheme._id)">
            <q-item-section avatar>
              <q-icon name="content_copy" />
            </q-item-section>
            <q-item-section>Copy search schema Id</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
  </div>

  <div class="row justify-center q-mt-md full-width">
    <q-pagination
      v-model="currentPage"
      color="secondary"
      size="md"
      :max="props.pagination.total" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'SearchResult',
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar, copyToClipboard } from 'quasar';
import { formatDate } from 'src/shared/helpers';

import { SearchSchemeData } from '../interfaces';

const $q = useQuasar();

/**
 * Define emits
 */
const props = defineProps({
  searchSchemesData: {
    type: Array,
  },
  pagination: {
    type: Object,
    required: true,
  },
  switchPage: {
    type: Function,
    required: true,
  },
  editSearchScheme: {
    type: Function,
    default: () => () => '',
  },
  removeSearchScheme: {
    type: Function,
    default: () => () => '',
  },
});

/**
 * Computed current page
 */
const currentPage = computed({
  get() {
    return props.pagination.page;
  },
  set(page) {
    props.switchPage(page);
  },
});

const allSearchSchemes = computed((): SearchSchemeData[] => {
  const { searchSchemesData } = props;

  return searchSchemesData as SearchSchemeData[];
});

/**
 * @description Toggle searchScheme details by id
 *
 * @param {string} searchSchemeId
 */
function expandSearchSchemeItem(searchSchemeId: string) {
  const searchSchemeReference = document.getElementById(`search-scheme-${searchSchemeId}`) as HTMLElement;

  if (!searchSchemeReference) return;

  const searchSchemeDetailsReference = searchSchemeReference.querySelector('.search-scheme-details') as HTMLElement;

  if (!searchSchemeDetailsReference) return;

  searchSchemeReference.classList.toggle('search-scheme-expanded');
  searchSchemeDetailsReference.classList.toggle('animated');

  const heightValue = searchSchemeDetailsReference?.classList.contains('animated') ? searchSchemeDetailsReference?.scrollHeight : 0;
  searchSchemeDetailsReference.style.height = `${heightValue}px`;
}

function copySearchSchema(currentSearchScheme: SearchSchemeData) {
  const { fields = [] } = currentSearchScheme;

  const schemaInJSON = JSON.stringify(fields, null, 2);

  copyDataToClipboard(schemaInJSON);
}

/**
 * @description Copy data to clipboard
 *
 * @param {string} data: data to copy to clipboard
 */
function copyDataToClipboard(data: string) {
  copyToClipboard(data)
    .then(() => {
      $q.notify({
        type: 'positive',
        message: 'Copied to transfer area!',
        timeout: 5000,
      });
    })
    .catch(() => {
      $q.notify({
        type: 'negative',
        message: 'Oops! Fail to copy event details!',
        timeout: 5000,
      });
    });
}

/**
 * @description Get account details
 *
 * @param {SearchSchemeData} searchScheme: Notification account data
 */
function accountDetails(searchScheme: SearchSchemeData): any[] {
  const { fields = [] } = searchScheme;

  return fields;
}

function getFieldsLabel(fields: any[]): string {
  const { length: fieldsLength = 0 } = fields;
  return `${fieldsLength} field${fieldsLength > 1 ? 's' : ''}`;
}
</script>

<style lang="scss" scoped>
.search-result-card_item {
  @media screen and (max-width: 1023px) {
    margin-bottom: 32px;
  }

  @media screen and (min-width: 1024px) {
    margin-bottom: 16px;
  }
}

.search-scheme-details {
  cursor: default;
  height: 0;
  overflow: hidden;
}

.search-scheme-expanded > .search-scheme-details {
  overflow: visible;
}

code {
  background: $grey-2;
  color: $dark;
  word-wrap: break-word;
  box-decoration-break: clone;
  padding: .1rem .3rem .2rem;
  border-radius: .2rem;
  font-family: monospace;
  max-width: 100%;
}
</style>

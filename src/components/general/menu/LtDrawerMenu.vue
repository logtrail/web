<template>
  <q-list>
    <q-item
      v-for="item in props.items"
      v-ripple
      exact
      :key="item.id"
      :to="item.route">
      <q-item-section avatar>
        <q-icon
          color="dark"
          :name="item.icon" />
      </q-item-section>

      <q-item-section>
        {{ item.label }}
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
export default {
  name: 'LtDrawerMenu',
};
</script>

<script lang="ts" setup>
const props = defineProps({
  items: {
    type: Array,
  },
});

</script>

<style lang="scss">
.q-item__section--avatar {
  min-width: 32px;
}

.q-router-link--active {
  background: none!important;

  * {
    color: $primary!important;
    font-weight: 600;
  }
}

.mini--active {
  color: $primary!important;
}

.mini-icon {
  font-size: 1.718em;
  padding: 2px 16px;

  & + & {
    margin-top: 18px;
  }
}
</style>

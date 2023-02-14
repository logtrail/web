<template>
  <q-select
    v-bind="componentDefaultProps">
    <template
      v-if="slots?.default"
      v-slot:default>
      <slot></slot>
    </template>

    <template
      v-if="slots?.prepend"
      v-slot:prepend>
      <slot name="prepend"></slot>
    </template>

    <template
      v-if="slots?.append"
      v-slot:append>
      <slot name="append"></slot>
    </template>

    <template
      v-if="slots?.before"
      v-slot:before>
      <slot name="before"></slot>
    </template>

    <template
      v-if="slots?.after"
      v-slot:after>
      <slot name="after"></slot>
    </template>

    <template
      v-if="slots?.label"
      v-slot:label>
      <slot name="label"></slot>
    </template>

    <template
      v-if="slots?.error"
      v-slot:error>
      <slot name="error"></slot>
    </template>

    <template
      v-if="slots?.hint"
      v-slot:hint>
      <slot name="hint"></slot>
    </template>

    <template
      v-if="slots?.counter"
      v-slot:counter>
      <slot name="counter"></slot>
    </template>

    <template
      v-if="slots?.loading"
      v-slot:loading>
      <slot name="loading"></slot>
    </template>

    <template
      v-if="slots?.selected"
      v-slot:selected>
      <slot name="selected"></slot>
    </template>

    <template
      v-if="slots?.before-options"
      v-slot:before-options>
      <slot name="before-options"></slot>
    </template>

    <template
      v-if="slots?.after-options"
      v-slot:after-options>
      <slot name="after-options"></slot>
    </template>

    <template
      v-if="slots['no-option']"
      v-slot:no-option>
      <slot name="no-option"></slot>
    </template>

    <template
      v-if="slots['selected-item']"
      v-slot:selected-item>
      <slot name="selected-item"></slot>
    </template>

    <template
      v-if="slots?.option"
      v-slot:option="scope">
      <slot name="option" :option="scope"></slot>
    </template>
  </q-select>
</template>

<script>
export default {
  name: 'LtSelect',
};
</script>

<script setup>
import { useSlots, ref } from 'vue';

const slots = useSlots();

const options = ref();

const componentDefaultProps = {
  outlined: true,
  dense: true,
  behavior: 'menu',
  'bg-color': 'white',
  'no-error-icon': true,
  'hide-bottom-space': true,
};
</script>

<style lang="scss">
</style>

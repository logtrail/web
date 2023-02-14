  <template>
  <q-input v-bind="componentDefaultProps">
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
  </q-input>
</template>

<script>
export default {
  name: 'LtInput',
};
</script>

<script setup>
import { useSlots } from 'vue';

const slots = useSlots();

const componentDefaultProps = {
  outlined: true,
  dense: true,
  'bg-color': 'white',
  'no-error-icon': true,
  'hide-bottom-space': true,
};
</script>

<style lang="scss">
</style>

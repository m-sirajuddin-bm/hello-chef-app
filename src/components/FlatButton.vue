<script setup>
const emits = defineEmits(["onClick"]);

defineProps({
  selected: {
    type: Boolean,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
});
</script>
<template>
  <button
    type="button"
    :disabled="disabled"
    :class="[
      'inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50',
      selected
        ? 'border-orange-500 bg-orange-500/10 hover:bg-orange-500/10'
        : '',
      disabled ? 'border-dashed text-gray-400/90 line-through' : '',
    ]"
    :style="disabled ? 'filter: grayscale(100%)' : ''"
    @click="() => emits('onClick')"
  >
    <slot></slot>
  </button>
</template>

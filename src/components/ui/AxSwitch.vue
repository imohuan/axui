<script setup lang="ts">
import { computed } from 'vue'
import type { ControlSize } from './types'
import { SWITCH_SIZE_STYLES } from './common'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    disabled?: boolean
    id?: string
    size?: ControlSize
  }>(),
  { disabled: false, size: 'md' },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const controlStyle = computed(() => SWITCH_SIZE_STYLES[props.size])

const trackClasses = computed(() => [
  'ax-switch-base',
  props.modelValue ? 'ax-switch-on' : 'ax-switch-off',
  props.disabled ? 'ax-switch-disabled' : 'ax-switch-enabled',
])

const thumbClasses = computed(() => [
  'ax-switch-thumb',
  props.modelValue ? 'ax-switch-thumb-on' : 'ax-switch-thumb-off',
])
</script>

<template>
  <button
    :id="id"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    :class="trackClasses"
    :style="controlStyle"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span :class="thumbClasses" />
  </button>
</template>

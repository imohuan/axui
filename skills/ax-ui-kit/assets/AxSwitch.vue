<script setup lang="ts">
import { computed } from 'vue'
import type { ControlSize } from './types'

const SIZE_CLASSES: Record<ControlSize, string> = {
  xs: 'ax-switch--xs',
  sm: 'ax-switch--sm',
  md: 'ax-switch--md',
  lg: 'ax-switch--lg',
  xl: 'ax-switch--xl',
}

const THUMB_ON_CLASSES: Record<ControlSize, string> = {
  xs: 'ax-switch__thumb--on-xs',
  sm: 'ax-switch__thumb--on-sm',
  md: 'ax-switch__thumb--on-md',
  lg: 'ax-switch__thumb--on-lg',
  xl: 'ax-switch__thumb--on-xl',
}

const THUMB_SIZE_CLASSES: Record<ControlSize, string> = {
  xs: 'ax-switch__thumb--xs',
  sm: 'ax-switch__thumb--sm',
  md: 'ax-switch__thumb--md',
  lg: 'ax-switch__thumb--lg',
  xl: 'ax-switch__thumb--xl',
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    disabled?: boolean
    id?: string
    size?: ControlSize
  }>(),
  {
    disabled: false,
    size: 'md',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const trackClasses = computed(() => [
  'ax-switch',
  SIZE_CLASSES[props.size],
  props.modelValue ? 'ax-switch--on' : 'ax-switch--off',
  props.disabled ? 'ax-switch--disabled' : 'ax-switch--enabled',
])

const thumbClasses = computed(() => [
  'ax-switch__thumb',
  THUMB_SIZE_CLASSES[props.size],
  props.modelValue ? THUMB_ON_CLASSES[props.size] : 'ax-switch__thumb--off',
])
</script>

<template>
  <button
    :id="id"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    :class="trackClasses"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span :class="thumbClasses" />
  </button>
</template>

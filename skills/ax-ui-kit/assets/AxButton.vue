<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import type { ButtonSize, ButtonVariant } from './types'
import { CONTROL_SIZE_STYLES } from './common'
import AxIcon from './AxIcon.vue'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    icon?: string
    iconSize?: string | number
    type?: 'button' | 'submit' | 'reset'
    block?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    icon: '',
    iconSize: 16,
    type: 'button',
    block: false,
    loading: false,
  },
)

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

let rippleId = 0
const ripples: Ref<Ripple[]> = ref([])

const isIconOnly = computed(() =>
  (props.size === 'icon' || props.size === 'icon-lg') && (!!props.icon || props.loading),
)

const isControlSize = (s: ButtonSize): s is 'xs' | 'sm' | 'md' | 'lg' | 'xl' =>
  s !== 'icon' && s !== 'icon-lg'

const controlStyle = computed(() =>
  isControlSize(props.size) ? CONTROL_SIZE_STYLES[props.size] : {},
)

const classes = computed(() => [
  'ax-button-base',
  isIconOnly.value
    ? (props.size === 'icon-lg' ? 'ax-button-icon-lg' : 'ax-button-icon')
    : `ax-button-${props.variant}`,
  props.block ? 'ax-button-block' : '',
  props.disabled ? 'ax-button-disabled' : '',
  props.loading ? 'ax-button-loading' : '',
])

const rippleClass = computed(() =>
  props.variant === 'primary' ? 'ax-ripple-light' : 'ax-ripple-dark',
)

const onClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) return

  const btn = e.currentTarget as HTMLElement
  const rect = btn.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  const id = ++rippleId
  ripples.value.push({
    id,
    x: e.clientX - rect.left - size / 2,
    y: e.clientY - rect.top - size / 2,
    size,
  })
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== id)
  }, 600)

  emit('click', e)
}
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :style="controlStyle"
    :disabled="disabled"
    @click="onClick"
  >
    <span
      v-for="r in ripples"
      :key="r.id"
      class="ax-ripple"
      :class="rippleClass"
      :style="{
        left: r.x + 'px',
        top: r.y + 'px',
        width: r.size + 'px',
        height: r.size + 'px',
      }"
    />

    <span v-if="loading" class="ax-button-spinner">
      <svg :style="{ width: iconSize + 'px', height: iconSize + 'px' }" viewBox="0 0 24 24" fill="none">
        <circle class="ax-button-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="ax-button-spinner-head" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
    </span>
    <AxIcon v-else-if="icon" :name="icon" :size="iconSize" />
    <slot name="prefix" />
    <slot v-if="!isIconOnly" />
    <slot name="suffix" />
  </button>
</template>

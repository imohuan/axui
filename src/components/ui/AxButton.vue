<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import type { ButtonSize, ButtonVariant, RoundedSize } from './types'
import { ROUNDED_CLASSES } from './common'
import AxIcon from './AxIcon.vue'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    rounded?: RoundedSize
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
    rounded: 'md',
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

const classes = computed(() => [
  'ax-button',
  `ax-button--${props.size}`,
  `ax-button--${props.variant}`,
  ROUNDED_CLASSES[props.rounded],
  props.block ? 'ax-button--block' : '',
  props.disabled ? 'ax-button--disabled' : '',
  props.loading ? 'ax-button--loading' : '',
])

const rippleClass = computed(() =>
  props.variant === 'primary' ? 'ax-ripple--light' : 'ax-ripple--dark',
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
    :disabled="disabled"
    @click="onClick"
  >
    <!-- Ripple -->
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

    <span v-if="loading" class="ax-button__spinner">
      <svg :style="{ width: iconSize + 'px', height: iconSize + 'px' }" viewBox="0 0 24 24" fill="none">
        <circle class="ax-button__spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="ax-button__spinner-head" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
    </span>
    <AxIcon v-else-if="icon" :name="icon" :size="iconSize" />
    <slot name="prefix" />
    <slot v-if="!isIconOnly" />
    <slot name="suffix" />
  </button>
</template>

<style scoped>
.ax-ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ax-ripple-anim 600ms ease-out forwards;
  pointer-events: none;
}

.ax-ripple--light {
  background: rgba(255, 255, 255, 0.3);
}

.ax-ripple--dark {
  background: rgba(0, 0, 0, 0.12);
}

@keyframes ax-ripple-anim {
  to {
    transform: scale(1);
    opacity: 0;
  }
}

.ax-button__spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.ax-button__spinner svg {
  animation: ax-button-spin 1s linear infinite;
}

.ax-button__spinner-track {
  opacity: 0.25;
}

.ax-button__spinner-head {
  opacity: 0.75;
}

@keyframes ax-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

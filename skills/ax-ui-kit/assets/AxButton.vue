<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import type { ButtonSize, ButtonVariant } from './types'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:opacity-90',
  outline: 'text-primary bg-white hover:bg-surface-container-high',
  ghost: 'text-secondary hover:bg-surface-container-low',
  danger: 'text-error hover:bg-error-container hover:text-on-error-container',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: 'h-[18px] px-1.5 py-px text-body-sm',
  sm: 'h-5 px-2 py-0.5 text-body-sm',
  md: 'h-6 px-2.5 py-1 text-label-md',
  lg: 'h-7 px-3 py-1.5 text-label-md',
  icon: 'w-6 h-6 p-0',
  'icon-lg': 'w-7 h-7 p-0',
}

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    icon?: string
    iconSize?: string
    type?: 'button' | 'submit' | 'reset'
    block?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    icon: '',
    iconSize: '16px',
    type: 'button',
    block: false,
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

const classes = computed(() => [
  'relative overflow-hidden inline-flex items-center justify-center gap-ax-xs font-label-md rounded-md transition-colors outline-none border-0 shrink-0',
  VARIANT_CLASSES[props.variant],
  SIZE_CLASSES[props.size],
  props.block ? 'w-full' : '',
  props.disabled ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
])

const rippleClass = computed(() =>
  props.variant === 'primary' ? 'ax-ripple--light' : 'ax-ripple--dark',
)

const onClick = (e: MouseEvent) => {
  if (props.disabled) return

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

    <span v-if="icon" class="material-symbols-outlined" :style="{ fontSize: iconSize }">{{ icon }}</span>
    <slot name="prefix" />
    <slot />
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
</style>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    showLabels?: boolean
    labelLeft?: string
    labelRight?: string
    showValue?: boolean
    valueLabel?: string
    labelPosition?: 'top' | 'right'
  }>(),
  {
    min: 0,
    max: 100,
    showLabels: false,
    labelLeft: '',
    labelRight: '',
    showValue: false,
    valueLabel: '',
    labelPosition: 'top',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const internalValue = ref(props.modelValue)
const isDragging = ref(false)

watch(() => props.modelValue, (val) => {
  if (!isDragging.value) {
    internalValue.value = val
  }
})

const percent = computed(() => {
  const range = props.max - props.min || 1
  return ((internalValue.value - props.min) / range) * 100
})

const displayValue = computed(() => {
  if (props.valueLabel) return props.valueLabel
  return `${internalValue.value}%`
})

const onInput = (e: Event) => {
  isDragging.value = true
  const val = Number((e.target as HTMLInputElement).value)
  internalValue.value = val
  emit('update:modelValue', val)
}

const onChange = async () => {
  isDragging.value = false
  await nextTick()
  internalValue.value = props.modelValue
}
</script>

<template>
  <!-- right layout: track left, labels right -->
  <div v-if="labelPosition === 'right' && (showLabels || showValue)" class="ax-flex ax-items-center ax-gap-sm ax-slider">
    <div class="ax-slider">
      <div class="ax-slider__track-bg" />
      <div :style="{ width: percent + '%' }" class="ax-slider__track-fill" />
      <input
        type="range"
        :value="internalValue"
        :min="min"
        :max="max"
        class="ax-slider__input"
        @input="onInput"
        @change="onChange"
      />
    </div>
    <div class="ax-flex ax-items-center ax-gap-xs ax-flex-shrink-0">
      <span v-if="showLabels" class="ax-text-label-md ax-color-secondary" style="font-size: 11px">{{ labelLeft }}</span>
      <span
        v-if="showValue"
        class="ax-text-label-md ax-color-primary"
        style="font-size: 11px; font-weight: 700; padding: 0 0.25rem; background-color: var(--ax-color-surface-container); border: 1px solid var(--ax-color-outline-variant); border-radius: var(--ax-radius-sm); font-variant-numeric: tabular-nums"
      >
        {{ displayValue }}
      </span>
      <span v-if="showLabels" class="ax-text-label-md ax-color-secondary" style="font-size: 11px">{{ labelRight }}</span>
    </div>
  </div>

  <!-- top layout: labels above, track below -->
  <div v-else class="ax-slider">
    <div
      v-if="showLabels || showValue"
      :class="[
        showLabels ? 'ax-flex ax-justify-between' : 'ax-flex ax-justify-end',
      ]"
      style="font-size: 11px; font-family: var(--ax-font-label-md); color: var(--ax-color-secondary); margin-bottom: 0.25rem"
    >
      <span v-if="showLabels">{{ labelLeft }}</span>
      <span
        v-if="showValue"
        style="color: var(--ax-color-primary); font-weight: 700; padding: 0 0.25rem; background-color: var(--ax-color-surface-container); border: 1px solid var(--ax-color-outline-variant); border-radius: var(--ax-radius-sm)"
      >
        {{ displayValue }}
      </span>
      <span v-if="showLabels">{{ labelRight }}</span>
    </div>
    <div class="ax-slider" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
      <div class="ax-slider__track-bg" />
      <div :style="{ width: percent + '%' }" class="ax-slider__track-fill" />
      <input
        type="range"
        :value="internalValue"
        :min="min"
        :max="max"
        class="ax-slider__input"
        @input="onInput"
        @change="onChange"
      />
    </div>
  </div>
</template>

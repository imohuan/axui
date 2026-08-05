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
  <div v-if="labelPosition === 'right' && (showLabels || showValue)" class="ax-slider-row">
    <div class="ax-slider-base">
      <div class="ax-slider-track-bg" />
      <div :style="{ width: percent + '%' }" class="ax-slider-track-fill" />
      <input
        type="range"
        :value="internalValue"
        :min="min"
        :max="max"
        class="ax-slider-input"
        @input="onInput"
        @change="onChange"
      />
    </div>
    <div class="ax-slider-labels">
      <span v-if="showLabels" class="ax-slider-label">{{ labelLeft }}</span>
      <span
        v-if="showValue"
        class="ax-slider-value-badge"
      >
        {{ displayValue }}
      </span>
      <span v-if="showLabels" class="ax-slider-label">{{ labelRight }}</span>
    </div>
  </div>

  <!-- top layout: labels above, track below -->
  <div v-else class="ax-slider-base">
    <div
      v-if="showLabels || showValue"
      :class="showLabels ? 'ax-slider-labels-between' : 'ax-slider-labels-end'"
    >
      <span v-if="showLabels">{{ labelLeft }}</span>
      <span
        v-if="showValue"
        class="ax-slider-value-badge"
      >
        {{ displayValue }}
      </span>
      <span v-if="showLabels">{{ labelRight }}</span>
    </div>
    <div class="ax-slider-base" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
      <div class="ax-slider-track-bg" />
      <div :style="{ width: percent + '%' }" class="ax-slider-track-fill" />
      <input
        type="range"
        :value="internalValue"
        :min="min"
        :max="max"
        class="ax-slider-input"
        @input="onInput"
        @change="onChange"
      />
    </div>
  </div>
</template>

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
  }>(),
  {
    min: 0,
    max: 100,
    showLabels: false,
    labelLeft: '',
    labelRight: '',
    showValue: false,
    valueLabel: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// 内部值：拖拽时实时更新，松手后同步回 props.modelValue
// - v-model 场景：emit → 父组件更新 prop → nextTick 同步到新值 → 留在新位置
// - :model-value 固定值场景：emit 被忽略 → prop 不变 → nextTick 同步回原值 → 弹回原位
const internalValue = ref(props.modelValue)
const isDragging = ref(false)

// 外部 prop 变化时同步（仅在非拖拽中）
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
  internalValue.value = Number((e.target as HTMLInputElement).value)
}

const onChange = async (e: Event) => {
  isDragging.value = false
  const val = Number((e.target as HTMLInputElement).value)
  emit('update:modelValue', val)
  // 等父组件响应后，用 prop 值同步回来
  // v-model → prop 已更新为 val → 保持新值
  // :model-value → prop 未变 → 弹回原值
  await nextTick()
  internalValue.value = props.modelValue
}
</script>

<template>
  <div class="relative w-full">
    <div
      v-if="showLabels || showValue"
      :class="[
        'text-[11px] font-label-md text-secondary mb-1',
        showLabels ? 'flex justify-between' : 'flex justify-end',
      ]"
    >
      <span v-if="showLabels">{{ labelLeft }}</span>
      <span
        v-if="showValue"
        class="text-primary font-bold px-1 bg-surface-container border border-outline-variant rounded"
      >
        {{ displayValue }}
      </span>
      <span v-if="showLabels">{{ labelRight }}</span>
    </div>
    <div class="relative flex items-center group py-2">
      <div
        class="absolute h-1.5 w-full bg-surface-container rounded-full pointer-events-none inset-y-0 my-auto"
      />
      <div
        :style="{ width: percent + '%' }"
        class="absolute h-1.5 bg-primary rounded-full pointer-events-none inset-y-0 my-auto"
      />
      <input
        type="range"
        :value="internalValue"
        :min="min"
        :max="max"
        class="w-full h-1.5 appearance-none bg-transparent cursor-pointer outline-none focus:outline-none relative z-10"
        @input="onInput"
        @change="onChange"
      />
    </div>
  </div>
</template>

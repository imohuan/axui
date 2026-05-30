<script setup lang="ts">
import type { PropPanelModel, PropPanelSchemaItem } from './types'
import AxSwitch from './AxSwitch.vue'

const props = withDefaults(
  defineProps<{
    modelValue: PropPanelModel
    schema: PropPanelSchemaItem[]
    title?: string
  }>(),
  {
    title: '属性配置',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: PropPanelModel]
}>()

const set = (key: string, value: unknown) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const sliderPercent = (item: PropPanelSchemaItem) => {
  const min = item.min ?? 0
  const max = item.max ?? 100
  const value = Number(props.modelValue[item.key] ?? min)
  const range = max - min || 1
  return ((value - min) / range) * 100
}
</script>

<template>
  <div class="w-full space-y-0.5">
    <p
      v-if="title"
      class="font-label-md text-[10px] text-secondary uppercase tracking-wider px-1 pb-2"
    >
      {{ title }}
    </p>

    <div
      v-for="item in schema"
      :key="item.key"
      class="flex items-start justify-between gap-ax-md py-2 px-1 rounded-lg hover:bg-surface-container-low group transition-colors"
    >
      <div class="min-w-0 flex-1 pt-0.5">
        <p class="font-body-sm text-[12px] font-semibold text-primary leading-tight">
          {{ item.label }}
        </p>
        <p
          v-if="item.description"
          class="font-body-sm text-[10px] text-secondary mt-0.5 leading-relaxed"
        >
          {{ item.description }}
        </p>
      </div>

      <div class="shrink-0 flex items-center">
        <template v-if="item.type === 'switch'">
          <AxSwitch
            :model-value="!!modelValue[item.key]"
            @update:model-value="set(item.key, $event)"
          />
        </template>

        <template v-else-if="item.type === 'segmented'">
          <div class="flex items-center bg-surface-container rounded-lg p-0.5 gap-0.5">
            <button
              v-for="opt in item.options"
              :key="opt.value"
              :class="
                modelValue[item.key] === opt.value
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-secondary hover:text-primary'
              "
              class="font-label-md text-[10px] px-2 py-1 rounded-md transition-all duration-150"
              @click="set(item.key, opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </template>

        <template v-else-if="item.type === 'select'">
          <div class="w-36">
            <select
              :value="modelValue[item.key] as string | number"
              class="w-full px-2 py-1 font-label-md text-[11px] bg-surface-container-low border border-outline-variant rounded-md focus:ring-1 focus:ring-primary text-primary cursor-pointer"
              @change="set(item.key, ($event.target as HTMLSelectElement).value)"
            >
              <option v-for="opt in item.options" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </template>

        <template v-else-if="item.type === 'slider'">
          <div class="flex items-center gap-ax-sm w-48">
            <div class="relative flex-1 flex items-center">
              <div
                class="absolute h-1 w-full bg-surface-container rounded-full pointer-events-none"
              />
              <div
                :style="{ width: sliderPercent(item) + '%' }"
                class="absolute h-1 bg-primary rounded-full pointer-events-none"
              />
              <input
                type="range"
                :value="modelValue[item.key] as number"
                :min="item.min || 0"
                :max="item.max || 100"
                :step="item.step || 1"
                class="w-full h-1 appearance-none bg-transparent cursor-pointer relative z-10"
                @input="set(item.key, Number(($event.target as HTMLInputElement).value))"
              />
            </div>
            <span
              class="font-label-md text-[10px] text-primary font-semibold w-6 text-right tabular-nums"
            >
              {{ modelValue[item.key] }}
            </span>
          </div>
        </template>

        <template v-else-if="item.type === 'input'">
          <input
            :value="modelValue[item.key] as string"
            :placeholder="item.placeholder || ''"
            class="w-36 px-2 py-1 font-label-md text-[11px] bg-surface-container-low border border-outline-variant rounded-md focus:ring-1 focus:ring-primary text-primary placeholder:text-outline"
            @input="set(item.key, ($event.target as HTMLInputElement).value)"
          />
        </template>

        <template v-else-if="item.type === 'textarea'">
          <textarea
            :value="modelValue[item.key] as string"
            :placeholder="item.placeholder || ''"
            :rows="item.rows || 3"
            class="w-48 px-2 py-1 font-label-md text-[11px] bg-surface-container-low border border-outline-variant rounded-md focus:ring-1 focus:ring-primary text-primary resize-none placeholder:text-outline"
            @input="set(item.key, ($event.target as HTMLTextAreaElement).value)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

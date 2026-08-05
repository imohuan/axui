<script setup lang="ts">
import type { PropPanelModel, PropPanelSchemaItem } from './types'
import AxSwitch from './AxSwitch.vue'
import AxButton from './AxButton.vue'
import AxSelect from './AxSelect.vue'
import AxSlider from './AxSlider.vue'
import AxInput from './AxInput.vue'

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
</script>

<template>
  <div class="ax-prop-panel-base">
    <p v-if="title" class="ax-prop-panel-title">
      {{ title }}
    </p>

    <div
      v-for="item in schema"
      :key="item.key"
      class="ax-prop-panel-item"
    >
      <div class="ax-prop-panel-label-area">
        <p class="ax-prop-panel-label">
          {{ item.label }}
        </p>
        <p
          v-if="item.description"
          class="ax-prop-panel-description"
        >
          {{ item.description }}
        </p>
      </div>

      <div class="ax-prop-panel-control">
        <template v-if="item.type === 'switch'">
          <AxSwitch
            :model-value="!!modelValue[item.key]"
            size="sm"
            @update:model-value="set(item.key, $event)"
          />
        </template>

        <template v-else-if="item.type === 'segmented'">
          <div class="ax-segmented-base">
            <AxButton
              v-for="opt in item.options"
              :key="opt.value"
              :variant="modelValue[item.key] === opt.value ? 'primary' : 'ghost'"
              size="sm"
              @click="set(item.key, opt.value)"
            >
              {{ opt.label }}
            </AxButton>
          </div>
        </template>

        <template v-else-if="item.type === 'select'">
          <AxSelect
            :model-value="modelValue[item.key] as string | number"
            :options="item.options"
            size="sm"
            style="width: 12rem"
            @update:model-value="set(item.key, $event)"
          />
        </template>

        <template v-else-if="item.type === 'slider'">
          <div class="ax-prop-panel-slider-row" style="width: 12rem">
            <AxSlider
              :model-value="modelValue[item.key] as number"
              :min="item.min || 0"
              :max="item.max || 100"
              @update:model-value="set(item.key, $event)"
            />
            <span class="ax-prop-panel-value" style="font-size: 10px; font-weight: 600; width: 1.5rem; text-align: right; font-variant-numeric: tabular-nums">
              {{ modelValue[item.key] }}
            </span>
          </div>
        </template>

        <template v-else-if="item.type === 'input'">
          <AxInput
            resize="none"
            :model-value="modelValue[item.key] as string"
            :placeholder="item.placeholder || ''"
            size="sm"
            style="width: 12rem"
            @update:model-value="set(item.key, $event)"
          />
        </template>

        <template v-else-if="item.type === 'textarea'">
          <AxInput
            multiline
            :model-value="modelValue[item.key] as string"
            :placeholder="item.placeholder || ''"
            resize="vertical"
            :rows="item.rows || 3"
            size="sm"
            style="width: 14rem"
            @update:model-value="set(item.key, $event)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

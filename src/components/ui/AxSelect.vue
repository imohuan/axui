<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import AxDropdown from './AxDropdown.vue'
import AxIcon from './AxIcon.vue'
import type { ControlSize, SelectOption } from './types'
import { CONTROL_SIZE_STYLES } from './common'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | (string | number)[]
    options?: SelectOption[]
    searchable?: boolean
    multiple?: boolean
    placeholder?: string
    searchPlaceholder?: string
    placement?: string
    dropdownWidth?: string
    dropdownMaxWidth?: string
    tagMaxWidth?: string
    triggerWidth?: string
    triggerMaxWidth?: string
    size?: ControlSize
  }>(),
  {
    modelValue: '',
    options: () => [],
    searchable: false,
    multiple: false,
    placeholder: '请选择',
    searchPlaceholder: '搜索...',
    placement: 'bottom-start',
    dropdownWidth: 'auto',
    dropdownMaxWidth: '300px',
    tagMaxWidth: '120px',
    triggerWidth: '',
    triggerMaxWidth: '',
    size: 'md',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[]]
  change: [value: string | number | (string | number)[]]
}>()

const open = ref(false)
const searchQuery = ref('')
const highlightIndex = ref(-1)
const searchInputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

// ---- Computed ----

const selectedValueArray = computed<(string | number)[]>(() => {
  if (props.multiple) {
    const mv = props.modelValue
    if (Array.isArray(mv)) return mv.slice()
    if (mv === '' || mv === undefined || mv === null) return []
    return [mv as string | number]
  }
  return props.modelValue !== '' && props.modelValue !== undefined ? [props.modelValue as string | number] : []
})

const selectedLabels = computed(() =>
  selectedValueArray.value.map((v) => {
    const opt = props.options.find((o) => o.value === v)
    return opt ? { value: v, label: opt.label } : { value: v, label: String(v) }
  }),
)

const displayLabel = computed(() => {
  if (props.multiple) {
    if (selectedLabels.value.length === 0) return props.placeholder
    return ''
  }
  return selectedLabels.value[0]?.label || props.placeholder
})

const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) return props.options
  const q = searchQuery.value.toLowerCase()
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

// ---- Methods ----

const isSelected = (opt: SelectOption) => selectedValueArray.value.includes(opt.value)

const selectOption = (opt: SelectOption) => {
  if (props.multiple) {
    const current = [...selectedValueArray.value]
    const idx = current.indexOf(opt.value)
    if (idx >= 0) {
      current.splice(idx, 1)
    } else {
      current.push(opt.value)
    }
    emit('update:modelValue', current as any)
    emit('change', current as any)
    searchQuery.value = ''
    highlightIndex.value = -1
  } else {
    emit('update:modelValue', opt.value as any)
    emit('change', opt.value as any)
    closeDropdown()
  }
}

const removeOption = (value: string | number) => {
  if (!props.multiple) return
  const current = selectedValueArray.value.filter((v) => v !== value)
  emit('update:modelValue', current as any)
  emit('change', current as any)
}

const closeDropdown = () => {
  open.value = false
  searchQuery.value = ''
  highlightIndex.value = -1
}

const openDropdown = () => {
  open.value = true
  nextTick(() => {
    if (props.searchable && searchInputRef.value) {
      searchInputRef.value.focus()
    }
  })
}

const handleClear = (e: Event) => {
  e.stopPropagation()
  if (props.multiple) {
    emit('update:modelValue', [] as any)
    emit('change', [] as any)
  } else {
    emit('update:modelValue', '' as any)
    emit('change', '' as any)
  }
}

const hasValue = computed(() =>
  props.multiple ? selectedValueArray.value.length > 0 : props.modelValue !== '' && props.modelValue !== undefined,
)

const tagLabelStyle = computed(() => {
  if (!props.tagMaxWidth) return {}
  return { maxWidth: props.tagMaxWidth }
})

const triggerStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.triggerWidth) s.minWidth = props.triggerWidth
  if (props.triggerMaxWidth) s.maxWidth = props.triggerMaxWidth
  return s
})

const controlStyle = computed(() => CONTROL_SIZE_STYLES[props.size])

// ---- Keyboard ----

const scrollToHighlight = () => {
  nextTick(() => {
    const items = listRef.value?.querySelectorAll('[data-option]')
    if (items?.length) {
      const el = items[highlightIndex.value] as HTMLElement
      el?.scrollIntoView({ block: 'nearest' })
    }
  })
}

const handleKeydown = (e: KeyboardEvent) => {
  const len = filteredOptions.value.length
  if (len === 0) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightIndex.value = highlightIndex.value < len - 1 ? highlightIndex.value + 1 : 0
      scrollToHighlight()
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightIndex.value = highlightIndex.value > 0 ? highlightIndex.value - 1 : len - 1
      scrollToHighlight()
      break
    case 'Enter':
      e.preventDefault()
      if (highlightIndex.value >= 0 && highlightIndex.value < len) {
        selectOption(filteredOptions.value[highlightIndex.value])
        if (!props.multiple) return
      }
      break
    case 'Escape':
      e.preventDefault()
      closeDropdown()
      break
  }
}

// ---- AxDropdown binding ----

const dropdownMenuWidth = computed(() =>
  props.dropdownWidth === 'match' || props.dropdownWidth === 'auto' ? '' : props.dropdownWidth,
)
const isMatchWidth = computed(() => props.dropdownWidth === 'match')

// 打开/关闭时重置搜索和高亮
watch(open, (val) => {
  if (!val) {
    searchQuery.value = ''
    highlightIndex.value = -1
  }
})
</script>

<template>
  <AxDropdown
    v-model="open"
    :placement="placement"
    :offset="4"
    :match-width="isMatchWidth"
    :menu-width="dropdownMenuWidth"
    :menu-max-width="dropdownMaxWidth"
    menu-class="ax-overflow-y-auto"
    :style="{ maxHeight: '14rem' }"
  >
    <!-- ============ Trigger area ============ -->
    <template #trigger="{ open: isOpen }">
      <div class="ax-select-trigger-wrapper" @click.stop>
        <!-- 搜索模式 -->
        <template v-if="searchable">
          <div
            :class="[
              'ax-select-trigger',
              isOpen ? 'ax-select-trigger-open' : '',
            ]"
            :style="[controlStyle, triggerStyle]"
            @click="!isOpen && openDropdown()"
          >
            <template v-if="!isOpen">
              <template v-if="multiple && selectedLabels.length > 0">
                <span
                  v-for="opt in selectedLabels"
                  :key="opt.value"
                  class="ax-select-tag"
                >
                  <span class="ax-select-tag-label" :style="tagLabelStyle">{{ opt.label }}</span>
                  <button
                    class="ax-select-tag-remove"
                    @click.stop="removeOption(opt.value)"
                  >
                    <AxIcon name="close" :size="12" />
                  </button>
                </span>
              </template>
              <span v-else style="text-align: left">
                <span v-if="multiple" class="ax-select-placeholder">{{ placeholder }}</span>
                <span v-else class="ax-select-value">{{ displayLabel }}</span>
              </span>
              <AxIcon name="expand_more" :size="16" class="ax-select-arrow" />
            </template>

            <template v-else>
              <div v-if="multiple && selectedLabels.length > 0" style="width: 100%">
                <span
                  v-for="opt in selectedLabels"
                  :key="opt.value"
                  class="ax-select-tag"
                >
                  <span class="ax-select-tag-label" :style="tagLabelStyle">{{ opt.label }}</span>
                  <button
                    class="ax-select-tag-remove"
                    @click.stop="removeOption(opt.value)"
                  >
                    <AxIcon name="close" :size="12" />
                  </button>
                </span>
              </div>
              <div style="min-height: 0; width: 100%">
                <input
                  ref="searchInputRef"
                  v-model="searchQuery"
                  type="text"
                  :placeholder="selectedLabels.length === 0 ? searchPlaceholder : ''"
                  class="ax-select-search-input"
                  autocomplete="off"
                  @keydown="handleKeydown"
                  @click.stop
                />
              </div>
            </template>
          </div>
        </template>

        <!-- 非搜索模式 -->
        <template v-else>
          <!-- 多选标签按钮 -->
          <button
            v-if="multiple"
            type="button"
            class="ax-select-trigger"
            :style="[controlStyle, triggerStyle]"
            @click="isOpen ? closeDropdown() : openDropdown()"
          >
            <template v-if="selectedLabels.length > 0">
              <span
                v-for="opt in selectedLabels"
                :key="opt.value"
                class="ax-select-tag"
              >
                <span class="ax-select-tag-label" :style="tagLabelStyle">{{ opt.label }}</span>
                <button
                  class="ax-select-tag-remove"
                  @click.stop="removeOption(opt.value)"
                >
                  <AxIcon name="close" :size="12" />
                </button>
              </span>
            </template>
            <span v-else class="ax-select-placeholder">{{ placeholder }}</span>

            <span style="margin-left: auto">
              <button
                v-if="hasValue"
                class="ax-select-tag-remove"
                @click.stop="handleClear"
              >
                <AxIcon name="close" :size="14" />
              </button>
              <AxIcon
                name="expand_more"
                :size="16"
                class="ax-select-arrow"
                :class="{ 'ax-select-arrow-open': isOpen }"
              />
            </span>
          </button>

          <!-- 普通单选按钮 -->
          <button
            v-else
            type="button"
            class="ax-select-trigger"
            :style="[controlStyle, triggerStyle]"
            @click="isOpen ? closeDropdown() : openDropdown()"
          >
            <span :class="hasValue ? 'ax-select-value' : 'ax-select-placeholder'">{{ displayLabel }}</span>
            <AxIcon
              name="expand_more"
              :size="16"
              class="ax-select-arrow"
              :class="{ 'ax-select-arrow-open': isOpen }"
            />
          </button>
        </template>
      </div>
    </template>

    <!-- ============ Dropdown content ============ -->
    <template #default>
      <div ref="listRef" class="ax-dropdown-body" style="space-y: 2px" @keydown="handleKeydown">
        <button
          v-for="(opt, index) in filteredOptions"
          :key="opt.value"
          type="button"
          data-option
          class="ax-select-option"
          :class="[
            !multiple && modelValue === opt.value
              ? 'ax-select-option-selected'
              : highlightIndex === index
                ? 'ax-select-option-highlighted'
                : multiple && isSelected(opt)
                  ? 'ax-select-option-multi-selected'
                  : '',
          ]"
          @click="selectOption(opt)"
          @mouseenter="highlightIndex = index"
        >
          <!-- 多选复选框 -->
          <span
            v-if="multiple"
            class="ax-select-checkbox"
            :class="isSelected(opt) ? 'ax-select-checkbox-checked' : ''"
          >
            <AxIcon v-if="isSelected(opt)" name="check" :size="12" />
          </span>
          <span class="ax-select-tag-label">{{ opt.label }}</span>
          <AxIcon
            v-if="!multiple && modelValue === opt.value"
            name="check"
            :size="16"
            style="margin-left: auto"
          />
        </button>
        <div
          v-if="filteredOptions.length === 0"
          class="ax-select-no-results"
        >
          无匹配选项
        </div>
      </div>
    </template>
  </AxDropdown>
</template>

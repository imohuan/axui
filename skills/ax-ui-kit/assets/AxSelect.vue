<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import AxDropdown from './AxDropdown.vue'
import type { ControlSize, SelectOption } from './types'

const SIZE_CLASSES: Record<ControlSize, string> = {
  xs: 'h-[18px] px-1.5 py-px text-body-sm',
  sm: 'h-5 px-2 py-0.5 text-body-sm',
  md: 'h-6 px-2.5 py-1 text-label-md',
  lg: 'h-7 px-3 py-1.5 text-label-md',
}

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
    dropdownWidth: 'match',
    dropdownMaxWidth: '',
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
    // 多选模式下，modelValue 可能是字符串（从单选切换而来），包装成数组
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
    // 多选时不关闭下拉
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
    menu-class="max-h-56 overflow-y-auto"
  >
    <!-- ============ Trigger area ============ -->
    <template #trigger="{ open: isOpen, toggle }">
      <div class="relative w-full" @click.stop>
        <!-- 搜索模式：打开时显示搜索输入框 -->
        <template v-if="searchable">
          <!-- 关闭态：多选标签按钮 -->
          <button
            v-if="!isOpen"
            type="button"
            :class="['w-full flex flex-wrap items-center gap-1 bg-surface-container-low border border-outline-variant rounded-md hover:bg-surface-container hover:border-outline focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-left', SIZE_CLASSES[props.size]]"
            :style="triggerStyle"
            @click="openDropdown()"
          >
            <template v-if="multiple && selectedLabels.length > 0">
              <span
                v-for="opt in selectedLabels"
                :key="opt.value"
                class="inline-flex items-center gap-1 bg-surface-container-high pl-1.5 pr-1 py-px rounded text-[11px] font-medium text-primary shrink-0"
              >
                <span class="truncate" :style="tagLabelStyle">{{ opt.label }}</span>
                <button
                  class="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 transition-colors"
                  @click.stop="removeOption(opt.value)"
                >
                  <span class="material-symbols-outlined text-[12px]">close</span>
                </button>
              </span>
            </template>
            <span v-else class="text-left grow">
              <span v-if="multiple" class="text-secondary">{{ placeholder }}</span>
              <span v-else class="text-primary font-medium">{{ displayLabel }}</span>
            </span>
            <span
              class="material-symbols-outlined text-secondary transition-transform duration-200 shrink-0 text-[16px] ml-auto"
            >
              expand_more
            </span>
          </button>

          <!-- 打开态：搜索输入框（标签行 + 输入行分层布局） -->
          <div
            v-else
            :class="['w-full flex flex-col gap-1 bg-surface-container-low border border-outline-variant rounded-md ring-1 ring-primary border-primary text-left', SIZE_CLASSES[props.size]]"
            :style="triggerStyle"
          >
            <!-- 标签行（仅多选） -->
            <div v-if="multiple && selectedLabels.length > 0" class="w-full flex flex-wrap items-center gap-1">
              <span
                v-for="opt in selectedLabels"
                :key="opt.value"
                class="inline-flex items-center gap-1 bg-primary/10 pl-1.5 pr-1 py-px rounded text-[11px] font-medium text-primary shrink-0"
              >
                <span class="truncate" :style="tagLabelStyle">{{ opt.label }}</span>
                <button
                  class="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary/20 transition-colors"
                  @click.stop="removeOption(opt.value)"
                >
                  <span class="material-symbols-outlined text-[12px]">close</span>
                </button>
              </span>
            </div>

            <!-- 输入行 -->
            <div class="w-full flex items-center gap-1">
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                :placeholder="selectedLabels.length === 0 ? searchPlaceholder : ''"
                class="flex-1 min-w-0 bg-transparent border-none outline-none text-primary font-medium placeholder:text-secondary text-label-md font-label-md"
                autocomplete="off"
                @keydown="handleKeydown"
                @click.stop
              />
              <button
                v-if="hasValue"
                class="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 transition-colors shrink-0"
                @click="handleClear"
              >
                <span class="material-symbols-outlined text-[14px] text-secondary">close</span>
              </button>
            </div>
          </div>
        </template>

        <!-- 非搜索模式 -->
        <template v-else>
          <!-- 多选标签按钮（flex-wrap 换行显示全部标签） -->
          <button
            v-if="multiple"
            type="button"
            :class="['w-full flex flex-wrap items-center gap-1 bg-surface-container-low border border-outline-variant rounded-md hover:bg-surface-container hover:border-outline focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-left', SIZE_CLASSES[props.size]]"
            :style="triggerStyle"
            @click="isOpen ? closeDropdown() : openDropdown()"
          >
            <template v-if="selectedLabels.length > 0">
              <span
                v-for="opt in selectedLabels"
                :key="opt.value"
                class="inline-flex items-center gap-1 bg-surface-container-high pl-1.5 pr-1 py-px rounded text-[11px] font-medium text-primary shrink-0"
              >
                <span class="truncate" :style="tagLabelStyle">{{ opt.label }}</span>
                <button
                  class="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 transition-colors"
                  @click.stop="removeOption(opt.value)"
                >
                  <span class="material-symbols-outlined text-[12px]">close</span>
                </button>
              </span>
            </template>
            <span v-else class="text-secondary grow text-left">{{ placeholder }}</span>

            <span class="inline-flex items-center gap-1 shrink-0 ml-auto">
              <button
                v-if="hasValue"
                class="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 transition-colors"
                @click.stop="handleClear"
              >
                <span class="material-symbols-outlined text-[14px] text-secondary">close</span>
              </button>
              <span
                class="material-symbols-outlined text-secondary transition-transform duration-200 text-[16px]"
                :class="{ 'rotate-180': isOpen }"
              >
                expand_more
              </span>
            </span>
          </button>

          <!-- 普通单选按钮 -->
          <button
            v-else
            type="button"
            :class="['w-full flex items-center justify-between bg-surface-container-low border border-outline-variant rounded-md hover:bg-surface-container hover:border-outline focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-left', SIZE_CLASSES[props.size]]"
            :style="triggerStyle"
            @click="isOpen ? closeDropdown() : openDropdown()"
          >
            <span :class="[hasValue ? 'text-primary font-medium' : 'text-secondary', 'truncate']">{{ displayLabel }}</span>
            <span
              class="material-symbols-outlined text-secondary transition-transform duration-200 shrink-0"
              :class="{ 'rotate-180': isOpen }"
            >
              expand_more
            </span>
          </button>
        </template>
      </div>
    </template>

    <!-- ============ Dropdown content ============ -->
    <template #default>
      <div ref="listRef" class="space-y-0.5" @keydown="handleKeydown">
        <button
          v-for="(opt, index) in filteredOptions"
          :key="opt.value"
          type="button"
          data-option
          class="flex w-full items-center gap-2 px-3 py-1.5 text-left font-label-md text-label-md rounded-lg transition-colors"
          :class="[
            !multiple && modelValue === opt.value
              ? 'bg-primary text-on-primary font-medium'
              : highlightIndex === index
                ? 'bg-surface-container-highest'
                : multiple && isSelected(opt)
                  ? 'bg-primary/10'
                  : 'text-primary hover:bg-surface-container-low',
          ]"
          @click="selectOption(opt)"
          @mouseenter="highlightIndex = index"
        >
          <!-- 多选复选框 -->
          <span
            v-if="multiple"
            class="inline-flex items-center justify-center w-4 h-4 rounded border transition-colors shrink-0"
            :class="isSelected(opt) ? 'bg-primary border-primary' : 'border-outline-variant'"
          >
            <span v-if="isSelected(opt)" class="material-symbols-outlined text-[12px] text-on-primary">check</span>
          </span>
          <span class="truncate">{{ opt.label }}</span>
          <span
            v-if="!multiple && modelValue === opt.value"
            class="material-symbols-outlined text-[16px] text-on-primary shrink-0 ml-auto"
          >
            check
          </span>
        </button>
        <div
          v-if="filteredOptions.length === 0"
          class="py-3 text-center font-body-sm text-[11px] text-secondary"
        >
          无匹配选项
        </div>
      </div>
    </template>
  </AxDropdown>
</template>

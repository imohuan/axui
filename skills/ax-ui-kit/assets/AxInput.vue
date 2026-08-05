<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { InputSize } from './types'
import { CONTROL_SIZE_STYLES } from './common'
import AxIcon from './AxIcon.vue'

const ICON_SIZE_MAP: Record<InputSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
}

const RESIZE_CLASSES: Record<string, string> = {
  none: 'ax-input-resize-none',
  vertical: 'ax-input-resize-vertical',
  horizontal: 'ax-input-resize-horizontal',
  both: 'ax-input-resize-both',
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: string
    placeholder?: string
    disabled?: boolean
    size?: InputSize
    password?: boolean
    autocomplete?: string
    multiline?: boolean
    rows?: number
    resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    disabled: false,
    size: 'md',
    password: false,
    autocomplete: undefined,
    multiline: false,
    rows: 3,
    resize: 'vertical',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  keydown: [event: KeyboardEvent]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const passwordVisible = ref(false)

const resolvedType = computed(() => {
  if (props.password) return passwordVisible.value ? 'text' : 'password'
  return props.type
})

const resolvedAutocomplete = computed(() => {
  if (props.autocomplete != null && props.autocomplete !== '') return props.autocomplete
  if (props.password) return 'new-password'
  return 'off'
})

const controlStyle = computed(() => CONTROL_SIZE_STYLES[props.size])

const inputClasses = computed(() => [
  'ax-input-base',
])

const textareaClasses = computed(() => [
  'ax-input-base',
  'ax-input-textarea',
  RESIZE_CLASSES[props.resize],
])

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

const onTextareaInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}

const togglePassword = () => {
  const input = inputRef.value
  const savedStart = input?.selectionStart ?? null
  const savedEnd = input?.selectionEnd ?? null
  passwordVisible.value = !passwordVisible.value
  nextTick(() => {
    input?.focus()
    if (savedStart !== null) {
      input?.setSelectionRange(savedStart, savedEnd ?? savedStart)
    }
  })
}

const focus = () => {
  if (props.multiline) {
    textareaRef.value?.focus()
  } else {
    inputRef.value?.focus()
  }
}

defineExpose({ focus, inputRef, textareaRef })
</script>

<template>
  <textarea
    v-if="multiline"
    ref="textareaRef"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :class="textareaClasses"
    :style="controlStyle"
    @input="onTextareaInput"
    @keydown="emit('keydown', $event)"
    @blur="emit('blur', $event)"
    @focus="emit('focus', $event)"
  />

  <div v-else class="ax-input-wrapper">
    <div
      v-if="$slots.prefix"
      class="ax-input-prefix"
    >
      <slot name="prefix" />
    </div>
    <input
      ref="inputRef"
      :type="resolvedType"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :autocomplete="resolvedAutocomplete"
      :class="[inputClasses, $slots.prefix ? 'ax-input-has-prefix' : '', ($slots.suffix || password) ? 'ax-input-has-suffix' : '']"
      :style="controlStyle"
      @input="onInput"
      @keydown="emit('keydown', $event)"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    />
    <div
      v-if="$slots.suffix && !password"
      class="ax-input-suffix"
    >
      <slot name="suffix" />
    </div>
    <button
      v-if="password"
      type="button"
      class="ax-input-password-toggle"
      :disabled="disabled"
      tabindex="-1"
      @click="togglePassword"
    >
      <AxIcon
        :name="passwordVisible ? 'visibility' : 'visibility_off'"
        :size="ICON_SIZE_MAP[size]"
      />
    </button>
  </div>
</template>

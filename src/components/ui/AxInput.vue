<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { InputSize, RoundedSize } from './types'
import AxIcon from './AxIcon.vue'

const ICON_SIZE_MAP: Record<InputSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
}

const ROUNDED_CLASSES: Record<RoundedSize, string> = {
  none: 'rounded-ax-none',
  xs: 'rounded-ax-xs',
  sm: 'rounded-ax-sm',
  md: 'rounded-ax-md',
  lg: 'rounded-ax-lg',
  xl: 'rounded-ax-xl',
  full: 'rounded-ax-full',
}

const RESIZE_CLASSES: Record<string, string> = {
  none: 'ax-input--resize-none',
  vertical: 'ax-input--resize-vertical',
  horizontal: 'ax-input--resize-horizontal',
  both: 'ax-input--resize-both',
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: string
    placeholder?: string
    disabled?: boolean
    size?: InputSize
    rounded?: RoundedSize
    password?: boolean
    /** 密码框默认 new-password；登录场景可传 current-password */
    autocomplete?: string
    /** 多行文本模式（textarea） */
    multiline?: boolean
    /** textarea 行数 */
    rows?: number
    /** textarea resize 行为：none | vertical | horizontal | both */
    resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    disabled: false,
    size: 'md',
    rounded: 'md',
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
  // 避免与同表单密码框混排时 Chrome 误判为登录表单并刷 DOM 警告
  return 'off'
})

const inputClasses = computed(() => [
  'ax-input',
  `ax-input--${props.size}`,
  ROUNDED_CLASSES[props.rounded],
])

const textareaClasses = computed(() => [
  'ax-input',
  'ax-input--textarea',
  `ax-input--textarea-${props.size}`,
  ROUNDED_CLASSES[props.rounded],
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
  // 切换 type 属性会重置光标，先保存位置再恢复
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
  <!-- textarea 多行模式 -->
  <textarea
    v-if="multiline"
    ref="textareaRef"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :class="textareaClasses"
    @input="onTextareaInput"
    @keydown="emit('keydown', $event)"
    @blur="emit('blur', $event)"
    @focus="emit('focus', $event)"
  />

  <!-- 单行 input 模式 -->
  <div v-else class="ax-input-wrapper">
    <div
      v-if="$slots.prefix"
      class="ax-input__prefix"
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
      :class="[inputClasses, $slots.prefix ? 'ax-input--has-prefix' : '', ($slots.suffix || password) ? 'ax-input--has-suffix' : '']"
      @input="onInput"
      @keydown="emit('keydown', $event)"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    />
    <!-- suffix slot (hidden when password mode is on) -->
    <div
      v-if="$slots.suffix && !password"
      class="ax-input__suffix"
    >
      <slot name="suffix" />
    </div>
    <!-- password visibility toggle -->
    <button
      v-if="password"
      type="button"
      class="ax-input__password-toggle"
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

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { InputSize } from './types'

const SIZE_CLASSES: Record<InputSize, string> = {
  sm: 'px-2.5 py-1 text-body-sm',
  md: 'px-3 py-1.5 text-label-md',
  lg: 'px-4 py-2.5 text-label-md',
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: string
    placeholder?: string
    disabled?: boolean
    size?: InputSize
    password?: boolean
    /** 密码框默认 new-password；登录场景可传 current-password */
    autocomplete?: string
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    disabled: false,
    size: 'md',
    password: false,
    autocomplete: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  keydown: [event: KeyboardEvent]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
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
  'w-full font-label-md bg-surface-container-low border border-outline-variant rounded-md',
  'focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-outline',
  'transition-all',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  SIZE_CLASSES[props.size],
])

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
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

const focus = () => inputRef.value?.focus()

defineExpose({ focus, inputRef })
</script>

<template>
  <div class="relative flex items-center w-full">
    <div
      v-if="$slots.prefix"
      class="absolute left-2.5 flex items-center text-secondary pointer-events-none z-10"
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
      :class="[inputClasses, $slots.prefix ? 'pl-8' : '', ($slots.suffix || password) ? 'pr-8' : '']"
      @input="onInput"
      @keydown="emit('keydown', $event)"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    />
    <!-- suffix slot (hidden when password mode is on) -->
    <div
      v-if="$slots.suffix && !password"
      class="absolute right-2.5 flex items-center text-secondary z-10"
    >
      <slot name="suffix" />
    </div>
    <!-- password visibility toggle -->
    <button
      v-if="password"
      type="button"
      class="absolute right-2.5 flex items-center text-secondary hover:text-primary z-10 cursor-pointer transition-colors"
      :disabled="disabled"
      tabindex="-1"
      @click="togglePassword"
    >
      <span class="material-symbols-outlined text-[18px]">
        {{ passwordVisible ? 'visibility' : 'visibility_off' }}
      </span>
    </button>
  </div>
</template>

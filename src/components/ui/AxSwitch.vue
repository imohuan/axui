<script setup lang="ts">
defineProps<{
  modelValue: boolean
  disabled?: boolean
  id?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <button
    :id="id"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    :class="[
      modelValue ? 'bg-primary' : 'bg-outline',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
    class="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-primary"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span
      :class="modelValue ? 'translate-x-4' : 'translate-x-0'"
      class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
    />
  </button>
</template>

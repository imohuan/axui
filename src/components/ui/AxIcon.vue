<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '../../icons'

const props = withDefaults(
  defineProps<{
    name: string
    size?: string | number
  }>(),
  {
    size: 24,
  },
)

const icon = computed(() => getIcon(props.name))

const sizePx = computed(() => {
  const s = props.size
  if (typeof s === 'number') return `${s}px`
  return s
})
</script>

<template>
  <svg
    v-if="icon"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="icon.viewBox"
    :width="sizePx"
    :height="sizePx"
    fill="currentColor"
    class="ax-icon"
  >
    <path v-if="!icon.html" :d="icon.path" />
    <g v-else v-html="icon.html" />
  </svg>
  <span v-else class="ax-icon-fallback" :style="{ fontSize: sizePx, lineHeight: 1 }">?</span>
</template>

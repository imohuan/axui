<script setup lang="ts">
import { computed } from 'vue'
import type { AlertType } from './types'
import AxIcon from './AxIcon.vue'

interface AlertConfig {
  container: string
  icon: string
}

const TYPE_CONFIG: Record<AlertType, AlertConfig> = {
  info: {
    container: 'ax-alert--info',
    icon: 'info',
  },
  error: {
    container: 'ax-alert--error',
    icon: 'error',
  },
  success: {
    container: 'ax-alert--success',
    icon: 'check_circle',
  },
  warning: {
    container: 'ax-alert--warning',
    icon: 'warning',
  },
}

const props = withDefaults(
  defineProps<{
    type?: AlertType
    title?: string
    modelValue?: boolean
    dismissible?: boolean
  }>(),
  {
    type: 'info',
    title: '',
    modelValue: true,
    dismissible: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  dismiss: []
}>()

const config = computed(() => TYPE_CONFIG[props.type])

const dismiss = () => {
  emit('update:modelValue', false)
  emit('dismiss')
}
</script>

<template>
  <Transition
    leave-active-class="ax-alert-leave-active"
    leave-from-class="ax-alert-leave-from"
    leave-to-class="ax-alert-leave-to"
  >
    <div
      v-show="modelValue"
      :class="['ax-alert', config.container]"
    >
      <div class="ax-alert__content">
        <AxIcon :name="config.icon" :size="16" class="ax-alert__icon" />
        <div>
          <p v-if="title" class="ax-alert__title">
            {{ title }}
          </p>
          <p class="ax-alert__description">
            <slot />
          </p>
        </div>
      </div>
      <button
        v-if="dismissible"
        class="ax-alert__close"
        @click="dismiss"
      >
        <AxIcon name="close" :size="14" />
      </button>
    </div>
  </Transition>
</template>

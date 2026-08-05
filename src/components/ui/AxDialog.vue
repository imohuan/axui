<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, onMounted } from 'vue'
import AxIcon from './AxIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    icon?: string
    maxWidth?: string
    closeOnOverlay?: boolean
    bodyClass?: string
  }>(),
  {
    modelValue: false,
    title: '',
    icon: '',
    maxWidth: 'ax-dialog-xl',
    closeOnOverlay: true,
    bodyClass: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const dialogRef = ref<HTMLElement | null>(null)
const closeBtnRef = ref<HTMLButtonElement | null>(null)
const triggerElement = ref<HTMLElement | null>(null)
const focusableRefs = ref<HTMLElement[]>([])

const registerFocusable = (el: HTMLElement) => {
  if (el && !focusableRefs.value.includes(el)) {
    focusableRefs.value.push(el)
  }
}

const open = () => {
  triggerElement.value = document.activeElement as HTMLElement | null
  emit('update:modelValue', true)
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    const first = focusableRefs.value.find((el) => el)
    if (first) first.focus()
  })
}

const close = () => {
  emit('update:modelValue', false)
  emit('close')
  document.body.style.overflow = ''
  nextTick(() => {
    if (triggerElement.value) triggerElement.value.focus()
  })
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      triggerElement.value = document.activeElement as HTMLElement | null
      document.body.style.overflow = 'hidden'
      nextTick(() => {
        const first = focusableRefs.value.find((el) => el)
        if (first) first.focus()
      })
    } else {
      document.body.style.overflow = ''
    }
  },
)

onMounted(() => {
  if (closeBtnRef.value) registerFocusable(closeBtnRef.value)
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})

const handleOverlayClick = () => {
  if (props.closeOnOverlay) close()
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    const elements = focusableRefs.value.filter((el) => el)
    if (elements.length === 0) return

    const first = elements[0]
    const last = elements[elements.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus()
        e.preventDefault()
      }
    } else if (document.activeElement === last) {
      first.focus()
      e.preventDefault()
    }
  }
}

const setFocusableRef = (el: HTMLElement | null) => {
  if (el) registerFocusable(el)
}

defineExpose({ open, close, setFocusableRef, dialogRef })
</script>

<template>
  <Transition
    enter-active-class="ax-dialog-overlay-enter-active"
    enter-from-class="ax-dialog-overlay-enter-from"
    enter-to-class="ax-dialog-overlay-enter-active"
    leave-active-class="ax-dialog-overlay-leave-active"
    leave-from-class="ax-dialog-overlay-leave-active"
    leave-to-class="ax-dialog-overlay-leave-to"
  >
    <div
      v-show="modelValue"
      class="ax-dialog-overlay"
      @click.self="handleOverlayClick"
    >
      <Transition
        enter-active-class="ax-dialog-enter-active"
        enter-from-class="ax-dialog-enter-from"
        enter-to-class="ax-dialog-enter-active"
        leave-active-class="ax-dialog-leave-active"
        leave-from-class="ax-dialog-leave-active"
        leave-to-class="ax-dialog-leave-to"
      >
        <div
          v-show="modelValue"
          ref="dialogRef"
          :class="['ax-dialog-base', maxWidth]"
          role="dialog"
          aria-modal="true"
          @keydown="handleKeyDown"
        >
          <div class="ax-dialog-header">
            <div class="ax-dialog-header-left">
              <AxIcon
                v-if="icon"
                :name="icon"
                :size="18"
                class="ax-dialog-header-icon"
              />
              <slot name="header">
                <h3 class="ax-dialog-title">
                  {{ title }}
                </h3>
              </slot>
            </div>
            <button
              ref="closeBtnRef"
              class="ax-dialog-close"
              aria-label="关闭弹窗"
              @click="close"
            >
              <AxIcon name="close" :size="18" />
            </button>
          </div>

          <div :class="['ax-dialog-body', bodyClass]">
            <slot :close="close" :set-focusable-ref="setFocusableRef" />
          </div>

          <div
            v-if="$slots.footer"
            class="ax-dialog-footer"
          >
            <slot name="footer" :close="close" :set-focusable-ref="setFocusableRef" />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

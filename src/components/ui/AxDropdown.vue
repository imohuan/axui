<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useFloating } from './hooks/useFloating'
import { useTeleportTarget } from './hooks/useTeleportTarget'

export type DropdownTrigger = 'click' | 'hover' | 'contextmenu'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    placement?: string
    offset?: number
    matchWidth?: boolean
    /** 触发方式：click 左键 | hover 悬停 | contextmenu 右键 */
    trigger?: DropdownTrigger
    /** hover 模式下鼠标离开触发器后延迟关闭的时间 (ms) */
    hoverCloseDelay?: number
    menuWidth?: string
    menuMaxWidth?: string
    /** 内容区扩展样式，替换默认 p-1 */
    bodyClass?: string
    teleport?: boolean
  }>(),
  {
    modelValue: false,
    placement: 'bottom-start',
    offset: 6,
    matchWidth: false,
    trigger: 'click',
    hoverCloseDelay: 150,
    menuWidth: '',
    menuMaxWidth: '',
    bodyClass: 'p-1',
    teleport: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const teleportTarget = useTeleportTarget()
const containerRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const closeTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const { floatingStyles, isPositioned } = useFloating(triggerRef, menuRef, {
  placement: computed(() => props.placement),
  offset: computed(() => props.offset),
  matchWidth: computed(() => props.matchWidth),
})

const menuStyle = computed(() => {
  const base: Record<string, any> = isPositioned.value
    ? { ...floatingStyles.value }
    : { position: 'fixed', left: '-9999px', top: '-9999px' }

  if (props.menuWidth) base.minWidth = props.menuWidth
  if (props.menuMaxWidth) base.maxWidth = props.menuMaxWidth

  return base
})

const open = () => {
  clearCloseTimer()
  emit('update:modelValue', true)
}
const close = () => {
  clearCloseTimer()
  emit('update:modelValue', false)
}
const toggle = () => emit('update:modelValue', !props.modelValue)

const clearCloseTimer = () => {
  if (closeTimer.value) {
    clearTimeout(closeTimer.value)
    closeTimer.value = null
  }
}
const scheduleClose = () => {
  clearCloseTimer()
  closeTimer.value = setTimeout(close, props.hoverCloseDelay)
}

// ---- 触发事件 ----
const triggerEvents = computed(() => {
  switch (props.trigger) {
    case 'hover':
      return { onMouseenter: open, onMouseleave: scheduleClose }
    case 'contextmenu':
      return {
        onContextmenu: (e: MouseEvent) => { e.preventDefault(); open() },
      }
    case 'click':
    default:
      return { onClick: toggle }
  }
})

// hover 模式下，鼠标移入面板取消关闭倒计时，移出则关闭
const panelEvents = computed(() => {
  if (props.trigger !== 'hover') return {}
  return { onMouseenter: clearCloseTimer, onMouseleave: close }
})

onClickOutside(containerRef, (e) => {
  if (menuRef.value?.contains(e.target as Node)) return
  if (props.modelValue) close()
})

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  clearCloseTimer()
})
</script>

<template>
  <div ref="containerRef" class="relative inline-block text-left">
    <div ref="triggerRef" v-bind="triggerEvents">
      <slot name="trigger" :open="modelValue" :toggle="toggle" :close="close" />
    </div>

    <Teleport :to="teleportTarget" :disabled="!teleport">
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="modelValue"
          ref="menuRef"
          :style="menuStyle"
          v-bind="panelEvents"
          :class="[
            'z-50 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-lg ring-1 ring-black ring-opacity-5 pro-shadow',
            bodyClass,
          ]"
          role="menu"
        >
          <slot :close="close" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

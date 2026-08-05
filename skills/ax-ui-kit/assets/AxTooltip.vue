<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFloating } from './hooks/useFloating'
import { useTeleportTarget } from './hooks/useTeleportTarget'

const props = withDefaults(
  defineProps<{
    content?: string
    placement?: string
    offset?: number
    arrow?: boolean
  }>(),
  {
    content: '',
    placement: 'top',
    offset: 8,
    arrow: true,
  },
)

const teleportTarget = useTeleportTarget()
const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)
const visible = ref(false)

const { floatingStyles, isPositioned, middlewareData, placement } = useFloating(
  triggerRef,
  tooltipRef,
  {
    placement: computed(() => props.placement),
    offset: computed(() => props.offset),
    arrowRef: props.arrow ? arrowRef : undefined,
  },
)

const tooltipStyle = computed(() =>
  isPositioned.value
    ? floatingStyles.value
    : { position: 'fixed' as const, left: '-9999px', top: '-9999px' },
)

const staticSideMap: Record<string, string> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

const ARROW_HALF = 5

const arrowStyle = computed(() => {
  const arrowData = middlewareData.value?.arrow
  const side = placement.value?.split('-')[0] ?? 'top'
  const staticSide = staticSideMap[side] ?? 'bottom'

  const style: Record<string, string> = {
    position: 'absolute',
    [staticSide]: `-${ARROW_HALF}px`,
  }

  if (arrowData) {
    if (arrowData.x != null) style.left = `${arrowData.x}px`
    if (arrowData.y != null) style.top = `${arrowData.y}px`
  }

  return style
})

const show = () => {
  visible.value = true
}

const hide = () => {
  visible.value = false
}
</script>

<template>
  <span
    ref="triggerRef"
    class="ax-tooltip-trigger"
    @mouseenter="show"
    @mouseleave="hide"
    @focus="show"
    @blur="hide"
  >
    <slot />
  </span>
  <Teleport :to="teleportTarget">
    <Transition
      enter-active-class="ax-tooltip-enter-active"
      enter-from-class="ax-tooltip-enter-from"
      enter-to-class="ax-tooltip-enter-active"
      leave-active-class="ax-tooltip-leave-active"
      leave-from-class="ax-tooltip-leave-active"
      leave-to-class="ax-tooltip-leave-to"
    >
      <div
        v-if="visible"
        ref="tooltipRef"
        :style="tooltipStyle"
        class="ax-tooltip-base"
      >
        <slot name="content">{{ content }}</slot>
        <div
          v-if="props.arrow"
          ref="arrowRef"
          :style="arrowStyle"
          class="ax-tooltip-arrow"
        />
      </div>
    </Transition>
  </Teleport>
</template>

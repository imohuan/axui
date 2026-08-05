<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useFloatingBall } from './use-floating-ball'
import type { FloatingBallPrefs, FloatingBallTheme } from './types'
import { AxButton } from '../..'

const props = withDefaults(
  defineProps<{
    prefs: FloatingBallPrefs
    settingsOpen?: boolean
  }>(),
  {
    settingsOpen: false,
  },
)

const emit = defineEmits<{
  openSettings: []
  openBallSettings: []
  mainClick: []
  savePrefs: [prefs: FloatingBallPrefs]
}>()

const prefsRef = toRef(props, 'prefs')

const {
  expanded,
  visible,
  dockSide,
  isDragging,
  dragMoved,
  closeSide,
  btnSize,
  stackHeight,
  toolbarStyle,
  toolbarHitAreaStyle,
  btnTop,
  closeTop,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onToolbarEnter,
  onToolbarLeave,
} = useFloatingBall(prefsRef, { settingsOpen: toRef(props, 'settingsOpen') })

// ---- Settings Dialog (using AxDialog) ----
const showBallSettings = ref(false)

function openBallSettingsDialog() {
  showBallSettings.value = true
}

// Draft prefs for settings form
const draftPrefs = ref<FloatingBallPrefs>({
  shrunk: props.prefs.shrunk,
  hidden: props.prefs.hidden,
  theme: props.prefs.theme,
  label: props.prefs.label,
})

function initDraft() {
  draftPrefs.value = {
    shrunk: props.prefs.shrunk,
    hidden: props.prefs.hidden,
    theme: props.prefs.theme,
    label: props.prefs.label,
  }
}

function saveSettings() {
  emit('savePrefs', { ...draftPrefs.value })
  showBallSettings.value = false
}

// Init draft when dialog opens
watch(showBallSettings, (open) => {
  if (open) initDraft()
})

onKeyStroke('Escape', () => {
  if (showBallSettings.value) showBallSettings.value = false
})

// ---- Computed classes ----
const slideOffset = computed(() => 0)
const isDarkTheme = computed(() => props.prefs.theme === 'dark')
const label = computed(() => props.prefs.label ?? 'FB')


const stackClass = computed(() => {
  const base = 'position: relative; overflow: visible; cursor: grab; transition: height 300ms ease-out, transform 300ms ease-out'
  const drag = isDragging.value ? '; cursor: grabbing' : ''
  const exp = expanded.value ? '; transform: translateX(0) !important' : ''
  return base + drag + exp
})

const fabBase =
  'position: absolute; left: 0; margin: 0; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border-radius: 9999px; border: 0; padding: 0; outline: none; transition: opacity 200ms ease-out, box-shadow 200ms ease-out, background-color 200ms ease-out, border-color 200ms ease-out; -webkit-tap-highlight-color: transparent'

const fabSoftClasses = `${fabBase}; z-index: 2; cursor: pointer; background: transparent; box-shadow: none`

const settingsIconClasses =
  'display: flex; align-items: center; justify-content: center; border-radius: 9999px; border: 1px solid rgba(243,243,244,0.9); background: #fff; color: var(--ax-color-ball); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)'

const fabMainClasses = computed(() => {
  const drag = isDragging.value ? 'cursor: grabbing' : 'cursor: grab'
  let radius = 'border-radius: 9999px'
  if (dockSide.value === 'left') radius = 'border-radius: 0 0.375rem 9999px 9999px'
  else if (dockSide.value === 'right') radius = 'border-radius: 9999px 0.375rem 9999px 0'

  if (isDarkTheme.value) {
    return `${fabBase}; z-index: 2; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.12); background: #27272a; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.4); ${drag}; ${radius}`
  }
  return `${fabBase}; z-index: 2; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid rgba(243,243,244,0.9); background: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); ${drag}; ${radius}`
})

const fabCloseClasses = computed(() => {
  const side = closeSide.value === 'left' ? 'right: -8px; left: auto' : 'left: -8px'
  return `${fabBase}; z-index: 3; width: 1rem !important; height: 1rem !important; cursor: pointer; background: #a1a1aa; color: #fff; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); ${side}`
})

function fabStyle(slot: 'main' | 'settings') {
  const index = slot === 'main' ? 0 : 1
  const show = !expanded.value ? slot === 'main' : true
  const hiddenSideOffset = 12
  const settingsTranslateX =
    slot === 'settings' && !expanded.value
      ? dockSide.value === 'left'
        ? -hiddenSideOffset
        : hiddenSideOffset
      : 0
  const dockInset = slot === 'main' && dockSide.value !== 'none' ? 2 : 0
  const mainLeft = slot === 'main' && dockSide.value === 'right' ? -dockInset : 0

  return {
    top: `${btnTop(index)}px`,
    width: `${btnSize.value + dockInset}px`,
    height: `${btnSize.value}px`,
    left: `${mainLeft}px`,
    opacity: show ? 1 : 0,
    pointerEvents: show ? ('auto' as const) : ('none' as const),
    transform: `translateX(${settingsTranslateX}px)`,
    transition: 'opacity 220ms ease, transform 220ms ease',
  } as const
}

function onMainPointerUp() {
  if (!dragMoved.value) emit('mainClick')
}

function settingsIconStyle() {
  return { width: `${btnSize.value}px`, height: `${btnSize.value}px` } as const
}

function innerBallStyle() {
  const innerSize = Math.max(0, btnSize.value - 6)
  if (dockSide.value === 'left') {
    return { width: `${innerSize}px`, height: `${innerSize}px`, marginRight: '3px', marginLeft: 'auto' } as const
  }
  if (dockSide.value === 'right') {
    return { width: `${innerSize}px`, height: `${innerSize}px`, marginLeft: '3px', marginRight: 'auto' } as const
  }
  return { width: `${innerSize}px`, height: `${innerSize}px` } as const
}

function themeCardClass(theme: FloatingBallTheme) {
  const selected = draftPrefs.value.theme === theme
  return selected
    ? { borderColor: 'var(--ax-color-primary)', backgroundColor: 'var(--ax-color-surface-container-low)' }
    : { borderColor: 'var(--ax-color-outline-variant)', backgroundColor: '#fff' }
}
</script>

<template>
  <!-- The floating ball -->
  <Transition
    enter-active-class=""
    leave-active-class=""
    enter-from-class=""
    leave-to-class=""
  >
    <div
      v-if="visible"
      class="ax-floating-ball-wrapper"
      :style="[{ ...toolbarStyle, ...toolbarHitAreaStyle, zIndex: 9999, touchAction: 'none', userSelect: 'none', position: 'fixed' }]"
      @mouseenter="onToolbarEnter"
      @mouseleave="onToolbarLeave"
    >
      <div
        :class="stackClass"
        :style="{
          width: `${btnSize}px`,
          height: `${stackHeight}px`,
          transform: `translateX(${slideOffset}px)`,
        }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <!-- Main ball button -->
        <button
          type="button"
          :class="fabMainClasses"
          :style="fabStyle('main')"
          aria-label="Floating Ball"
          @pointerup="onMainPointerUp"
        >
          <span
            :style="[{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', background: 'linear-gradient(to bottom right, var(--ax-color-ball-light), var(--ax-color-ball))', color: '#fff', boxShadow: '0 1px 2px 0 rgba(99,102,241,0.4)', position: 'relative' }, innerBallStyle()]"
            aria-hidden="true"
          >
            <span
              :style="{ fontWeight: 800, fontStyle: 'italic', lineHeight: 1, letterSpacing: '-0.025em', color: '#fff', fontSize: prefs.shrunk ? '9px' : '11px' }"
            >{{ label }}</span>
          </span>
        </button>

        <!-- Settings button -->
        <button
          type="button"
          data-no-drag
          :class="fabSoftClasses"
          :style="fabStyle('settings')"
          aria-label="设置"
          @click.stop="emit('openSettings')"
        >
          <span
            :class="settingsIconClasses"
            :style="settingsIconStyle()"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9h12M8 14h8M10 19h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <circle cx="6" cy="9" r="1.5" fill="currentColor" />
              <circle cx="16" cy="14" r="1.5" fill="currentColor" />
              <circle cx="12" cy="19" r="1.5" fill="currentColor" />
            </svg>
          </span>
        </button>

        <!-- Close / ball settings button -->
        <button
          v-show="expanded"
          type="button"
          data-no-drag
          :class="fabCloseClasses"
          :style="{ top: `${closeTop}px` }"
          aria-label="悬浮球设置"
          @click="openBallSettingsDialog"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>

  <AxDialog
    v-model="showBallSettings"
    title="悬浮球设置"
    icon="tune"
    max-width="28rem"
    @close="showBallSettings = false"
  >
    <div class="ax-space-y-md">
      <div>
        <h2 class="ax-text-headline-sm" style="color: var(--ax-color-primary)">外观与行为</h2>
        <p class="ax-text-body-sm" style="color: var(--ax-color-on-surface-variant); margin-top: 0.25rem">配置悬浮球的显示样式与交互选项。</p>
      </div>

      <section style="border: 1px solid var(--ax-color-outline-variant); border-radius: var(--ax-radius-lg); background-color: var(--ax-color-surface-container-lowest); padding: 1rem">
        <label class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">主题样式</label>
        <p class="ax-text-body-sm" style="color: var(--ax-color-on-surface-variant); margin-top: 0.25rem; margin-bottom: 0.5rem">选择悬浮球的外观配色方案</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--ax-spacing-sm)">
          <button
            type="button"
            :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--ax-radius-lg)', border: '1px solid', padding: '1rem', transition: 'all 200ms', ...themeCardClass('light') }"
            aria-label="亮色"
            @click="draftPrefs.theme = 'light'"
          >
            <span :style="{ display: 'flex', width: '2.25rem', height: '2.25rem', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', border: '1px solid rgba(243,243,244,0.9)', background: '#fff', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }">
              <span
                :style="{ display: 'flex', width: '1.75rem', height: '1.75rem', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', background: 'linear-gradient(to bottom right, var(--ax-color-ball-light), var(--ax-color-ball))', fontSize: '10px', fontWeight: 800, fontStyle: 'italic', color: '#fff', boxShadow: '0 1px 2px 0 rgba(99,102,241,0.4)' }"
              >FB</span>
            </span>
            <span class="ax-text-label-md" style="color: var(--ax-color-primary)">亮色</span>
          </button>
          <button
            type="button"
            :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--ax-radius-lg)', border: '1px solid', padding: '1rem', transition: 'all 200ms', ...themeCardClass('dark') }"
            aria-label="暗色"
            @click="draftPrefs.theme = 'dark'"
          >
            <span :style="{ display: 'flex', width: '2.25rem', height: '2.25rem', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.12)', background: '#27272a', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.4)' }">
              <span
                :style="{ display: 'flex', width: '1.75rem', height: '1.75rem', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', background: 'linear-gradient(to bottom right, var(--ax-color-ball-light), var(--ax-color-ball))', fontSize: '10px', fontWeight: 800, fontStyle: 'italic', color: '#fff', boxShadow: '0 1px 2px 0 rgba(99,102,241,0.4)' }"
              >FB</span>
            </span>
            <span class="ax-text-label-md" style="color: var(--ax-color-primary)">暗色</span>
          </button>
        </div>
      </section>

      <section style="border: 1px solid var(--ax-color-outline-variant); border-radius: var(--ax-radius-lg); background-color: var(--ax-color-surface-container-lowest)">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-bottom: 1px solid rgba(200,197,202,0.4)">
          <div style="display: flex; flex-direction: column; gap: var(--ax-spacing-xs)">
            <label for="ball-shrunk" class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">缩小悬浮球</label>
            <p class="ax-text-body-sm" style="color: var(--ax-color-on-surface-variant)">切换更小的悬浮球尺寸，节省屏幕空间</p>
          </div>
          <button
            id="ball-shrunk"
            type="button"
            role="switch"
            :aria-checked="draftPrefs.shrunk"
            :style="{ position: 'relative', display: 'inline-flex', height: '1.25rem', width: '2.25rem', flexShrink: 0, cursor: 'pointer', alignItems: 'center', borderRadius: '9999px', padding: '0.125rem', transition: 'background-color 200ms', outline: 'none', backgroundColor: draftPrefs.shrunk ? 'var(--ax-color-primary)' : 'var(--ax-color-outline)' }"
            @click="draftPrefs.shrunk = !draftPrefs.shrunk"
          >
            <span
              :style="{ pointerEvents: 'none', display: 'inline-block', height: '1rem', width: '1rem', borderRadius: '9999px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', transition: 'transform 200ms ease-in-out', transform: draftPrefs.shrunk ? 'translateX(1rem)' : 'translateX(0)' }"
            />
          </button>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem">
          <div style="display: flex; flex-direction: column; gap: var(--ax-spacing-xs)">
            <label for="ball-hidden" class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">隐藏悬浮球</label>
            <p class="ax-text-body-sm" style="color: var(--ax-color-on-surface-variant)">完全隐藏悬浮球，可在设置中恢复显示</p>
          </div>
          <button
            id="ball-hidden"
            type="button"
            role="switch"
            :aria-checked="draftPrefs.hidden"
            :style="{ position: 'relative', display: 'inline-flex', height: '1.25rem', width: '2.25rem', flexShrink: 0, cursor: 'pointer', alignItems: 'center', borderRadius: '9999px', padding: '0.125rem', transition: 'background-color 200ms', outline: 'none', backgroundColor: draftPrefs.hidden ? 'var(--ax-color-primary)' : 'var(--ax-color-outline)' }"
            @click="draftPrefs.hidden = !draftPrefs.hidden"
          >
            <span
              :style="{ pointerEvents: 'none', display: 'inline-block', height: '1rem', width: '1rem', borderRadius: '9999px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', transition: 'transform 200ms ease-in-out', transform: draftPrefs.hidden ? 'translateX(1rem)' : 'translateX(0)' }"
            />
          </button>
        </div>
      </section>
    </div>

    <template #footer="{ close }">
      <AxButton variant="outline" @click="close">取消</AxButton>
      <AxButton @click="saveSettings()">保存</AxButton>
    </template>
  </AxDialog>
</template>

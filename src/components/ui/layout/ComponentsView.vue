<script setup lang="ts">
import { ref } from 'vue'
import type { PropPanelSchemaItem } from '../types'
import { FloatingBall } from '../functional'
import type { FloatingBallPrefs } from '../functional'
import { useNotify } from '../hooks/useNotify'
import AxIcon from '../AxIcon.vue'

const emit = defineEmits<{
  'open-dialog': []
  'open-simple-dialog': []
}>()

const btnProps = ref({
  variant: 'primary' as const,
  size: 'md' as const,
  rounded: 'md',
  disabled: false,
  showIcon: false,
  loading: false,
  block: false,
  label: '操作按钮',
})
const btnSchema: PropPanelSchemaItem[] = [
  { key: 'variant', label: '变体', type: 'segmented', options: [{ value: 'primary', label: 'Primary' }, { value: 'outline', label: 'Outline' }, { value: 'ghost', label: 'Ghost' }, { value: 'danger', label: 'Danger' }] },
  { key: 'size', label: '尺寸', type: 'segmented', options: [{ value: 'xs', label: 'XS' }, { value: 'sm', label: 'SM' }, { value: 'md', label: 'MD' }, { value: 'lg', label: 'LG' }, { value: 'xl', label: 'XL' }, { value: 'icon', label: 'Icon' }, { value: 'icon-lg', label: 'Icon-lg' }] },
  { key: 'rounded', label: '圆角', type: 'segmented', options: [{ value: 'none', label: 'None' }, { value: 'xs', label: 'XS' }, { value: 'sm', label: 'SM' }, { value: 'md', label: 'MD' }, { value: 'lg', label: 'LG' }, { value: 'xl', label: 'XL' }, { value: 'full', label: 'Full' }] },
  { key: 'label', label: '文案', type: 'textarea', placeholder: '按钮文字' },
  { key: 'showIcon', label: '显示图标', description: '在按钮左侧显示 bolt 图标', type: 'switch' },
  { key: 'loading', label: '加载状态', description: '展示旋转加载动画', type: 'switch' },
  { key: 'disabled', label: '禁用', description: '点击无响应，透明度降低', type: 'switch' },
  { key: 'block', label: '块级', description: '宽度撑满父容器', type: 'switch' },
]

const inputProps = ref({ value: '', size: 'md' as const, rounded: 'md', disabled: false, showPrefix: false, showSuffix: false, showPassword: false, placeholder: '请输入内容...', showMultiline: false, inputRows: 3, resize: 'vertical' as 'none' | 'vertical' | 'horizontal' | 'both' })
const inputSchema: PropPanelSchemaItem[] = [
  { key: 'size', label: '尺寸', type: 'segmented', options: [{ value: 'xs', label: 'XS' }, { value: 'sm', label: 'SM' }, { value: 'md', label: 'MD' }, { value: 'lg', label: 'LG' }, { value: 'xl', label: 'XL' }] },
  { key: 'rounded', label: '圆角', type: 'segmented', options: [{ value: 'none', label: 'None' }, { value: 'xs', label: 'XS' }, { value: 'sm', label: 'SM' }, { value: 'md', label: 'MD' }, { value: 'lg', label: 'LG' }, { value: 'xl', label: 'XL' }, { value: 'full', label: 'Full' }] },
  { key: 'showMultiline', label: '多行模式', description: '切换为 textarea 多行文本输入', type: 'switch' },
  { key: 'placeholder', label: '占位符', type: 'textarea', placeholder: '占位文本' },
  { key: 'inputRows', label: '行数', description: 'textarea 显示行数', type: 'slider', min: 1, max: 10 },
  { key: 'resize', label: 'Resize', description: 'textarea 拖拽缩放方向', type: 'segmented', options: [{ value: 'vertical', label: '纵向' }, { value: 'horizontal', label: '横向' }, { value: 'both', label: '双向' }, { value: 'none', label: '禁用' }] },
  { key: 'showPassword', label: '密码模式', description: '显示密码显隐切换小眼睛（仅单行）', type: 'switch' },
  { key: 'showPrefix', label: '前缀图标', description: '在输入框左侧显示图标（仅单行）', type: 'switch' },
  { key: 'showSuffix', label: '后置图标', description: '在输入框右侧显示图标（仅单行）', type: 'switch' },
  { key: 'disabled', label: '禁用', description: '不可输入状态', type: 'switch' },
]

const sliderProps = ref({ value: 50, min: 0, max: 100, showLabels: true, showValue: true, labelPosition: 'top' as 'top' | 'right' })
const sliderSchema: PropPanelSchemaItem[] = [
  { key: 'value', label: '当前值', type: 'slider', min: 0, max: 100 },
  { key: 'min', label: '最小值', type: 'slider', min: 0, max: 50 },
  { key: 'max', label: '最大值', type: 'slider', min: 50, max: 200 },
  { key: 'labelPosition', label: '标签位置', type: 'segmented', options: [{ value: 'top', label: '上方' }, { value: 'right', label: '右侧' }] },
  { key: 'showLabels', label: '显示标签', description: '左右端点标签文字', type: 'switch' },
  { key: 'showValue', label: '显示数值', description: '滑块上方数值气泡', type: 'switch' },
]

const switchProps = ref({ checked: true, disabled: false, size: 'md' as string })
const switchSchema: PropPanelSchemaItem[] = [
  { key: 'size', label: '尺寸', type: 'segmented', options: [{ value: 'xs', label: 'XS' }, { value: 'sm', label: 'SM' }, { value: 'md', label: 'MD' }, { value: 'lg', label: 'LG' }, { value: 'xl', label: 'XL' }] },
  { key: 'checked', label: '开关', description: '开关状态，支持 v-model', type: 'switch' },
  { key: 'disabled', label: '禁用', description: '不可交互状态，半透明显示', type: 'switch' },
]

const alertProps = ref({
  type: 'info' as const,
  title: '系统通知',
  message: '核心集群控制链已就绪，当前各项数据运行处于标准健康状态。',
  dismissible: true,
})
const alertSchema: PropPanelSchemaItem[] = [
  { key: 'type', label: '类型', type: 'segmented', options: [{ value: 'info', label: 'Info' }, { value: 'success', label: 'Success' }, { value: 'warning', label: 'Warning' }, { value: 'error', label: 'Error' }] },
  { key: 'title', label: '标题', type: 'input', placeholder: '警示标题' },
  { key: 'message', label: '内容', type: 'textarea', placeholder: '警示内容', rows: 5 },
  { key: 'dismissible', label: '可关闭', description: '显示右上角关闭按钮', type: 'switch' },
]

const demoSelectOptions = [
  { value: 'opt1', label: 'Vue 3 — 渐进式框架' },
  { value: 'opt2', label: 'React — UI 组件库' },
  { value: 'opt3', label: 'Angular — 全量框架' },
  { value: 'opt4', label: 'Svelte — 编译时框架' },
  { value: 'opt5', label: 'Solid.js — 细粒度响应' },
]
const selectProps = ref({ value: 'opt1' as unknown, size: 'md' as string, rounded: 'md', searchable: false, multiple: false, placeholder: '请选择框架...', placement: 'bottom-start', dropdownWidth: 'auto' as string, dropdownMaxWidth: '' as string, tagMaxWidth: '120px' as string, triggerWidth: '' as string, triggerMaxWidth: '' as string })
const selectSchema: PropPanelSchemaItem[] = [
  { key: 'size', label: '尺寸', type: 'segmented', options: [{ value: 'xs', label: 'XS' }, { value: 'sm', label: 'SM' }, { value: 'md', label: 'MD' }, { value: 'lg', label: 'LG' }, { value: 'xl', label: 'XL' }] },
  { key: 'rounded', label: '圆角', type: 'segmented', options: [{ value: 'none', label: 'None' }, { value: 'xs', label: 'XS' }, { value: 'sm', label: 'SM' }, { value: 'md', label: 'MD' }, { value: 'lg', label: 'LG' }, { value: 'xl', label: 'XL' }, { value: 'full', label: 'Full' }] },
  { key: 'placeholder', label: '占位符', type: 'textarea', placeholder: '占位文本' },
  { key: 'searchable', label: '可搜索', description: '点击下拉后按钮变为搜索输入框', type: 'switch' },
  { key: 'multiple', label: '多选', description: '支持勾选多项，已选项以标签展示', type: 'switch' },
  { key: 'placement', label: '弹出方向', type: 'input', placeholder: '如 bottom-start、top' },
  { key: 'dropdownWidth', label: '下拉最小宽度', type: 'input', placeholder: 'match / auto / 200px' },
  { key: 'dropdownMaxWidth', label: '下拉最大宽度', type: 'input', placeholder: '如 320px（留空=不限制）' },
  { key: 'tagMaxWidth', label: '标签最大宽度', type: 'input', placeholder: '如 120px（留空=不限制）' },
  { key: 'triggerWidth', label: '触发框最小宽度', type: 'input', placeholder: '如 200px（留空=自适应）' },
  { key: 'triggerMaxWidth', label: '触发框最大宽度', type: 'input', placeholder: '如 320px（留空=不限制）' },
]

const tooltipProps = ref({ content: '这是一条 Tooltip 提示文字', placement: 'top' as const, arrow: true, offset: 8 })
const tooltipSchema: PropPanelSchemaItem[] = [
  { key: 'content', label: '提示文字', type: 'textarea', placeholder: 'Tooltip 内容' },
  { key: 'placement', label: '方向', type: 'select', options: [
    { value: 'top', label: 'top' }, { value: 'bottom', label: 'bottom' }, { value: 'left', label: 'left' }, { value: 'right', label: 'right' },
    { value: 'top-start', label: 'top-start' }, { value: 'top-end', label: 'top-end' }, { value: 'bottom-start', label: 'bottom-start' }, { value: 'bottom-end', label: 'bottom-end' },
  ]},
  { key: 'offset', label: '距离', type: 'slider', min: 0, max: 32 },
  { key: 'arrow', label: '显示箭头', description: '指向触发元素的小三角箭头', type: 'switch' },
]

const showDropdownDemo1 = ref(false)
const showDropdownDemo2 = ref(false)

const popoverProps = ref({
  title: '通知详情', icon: 'settings', placement: 'bottom-start' as const, offset: 6,
  trigger: 'click' as const, hoverCloseDelay: 150, width: '', maxWidth: '', teleport: true,
})
const popoverSchema: PropPanelSchemaItem[] = [
  { key: 'title', label: '标题', type: 'input', placeholder: 'Popover 标题' },
  { key: 'icon', label: '图标名', type: 'input', placeholder: 'Material Symbol 图标名' },
  { key: 'trigger', label: '触发方式', type: 'segmented', options: [{ value: 'click', label: '左键点击' }, { value: 'hover', label: '悬停' }, { value: 'contextmenu', label: '右键' }] },
  { key: 'hoverCloseDelay', label: '悬停关闭延迟', description: 'hover 模式下鼠标离开后等待关闭的毫秒数', type: 'slider', min: 0, max: 500 },
  { key: 'placement', label: '弹出方向', type: 'select', options: [
    { value: 'bottom-start', label: '左下 (bottom-start)' }, { value: 'bottom', label: '下方 (bottom)' }, { value: 'bottom-end', label: '右下 (bottom-end)' },
    { value: 'top-start', label: '左上 (top-start)' }, { value: 'top', label: '上方 (top)' }, { value: 'top-end', label: '右上 (top-end)' },
    { value: 'left-start', label: '左对齐 (left-start)' }, { value: 'left', label: '左侧 (left)' }, { value: 'left-end', label: '左下对齐 (left-end)' },
    { value: 'right-start', label: '右对齐 (right-start)' }, { value: 'right', label: '右侧 (right)' }, { value: 'right-end', label: '右下对齐 (right-end)' },
  ]},
  { key: 'offset', label: '偏移距离', type: 'slider', min: 0, max: 24 },
  { key: 'width', label: '面板最小宽度', type: 'input', placeholder: '如: 260px' },
  { key: 'maxWidth', label: '面板最大宽度', type: 'input', placeholder: '如: 400px' },
  { key: 'teleport', label: '传送至 body', description: '将面板渲染到 body 元素下', type: 'switch' },
]

const showPopoverDemo1 = ref(false)
const showPopoverDemo2 = ref(false)
const showPopoverDemo3 = ref(false)

const dropdownProps = ref({
  placement: 'bottom-start' as const, offset: 6, matchWidth: false, trigger: 'click' as const,
  menuWidth: '', menuMaxWidth: '', teleport: true,
})
const dropdownSchema: PropPanelSchemaItem[] = [
  { key: 'trigger', label: '触发方式', type: 'segmented', options: [{ value: 'click', label: '左键点击' }, { value: 'hover', label: '悬停' }, { value: 'contextmenu', label: '右键' }] },
  { key: 'placement', label: '弹出方向', type: 'select', options: [
    { value: 'bottom-start', label: '左下 (bottom-start)' }, { value: 'bottom', label: '下方 (bottom)' }, { value: 'bottom-end', label: '右下 (bottom-end)' },
    { value: 'top-start', label: '左上 (top-start)' }, { value: 'top', label: '上方 (top)' }, { value: 'top-end', label: '右上 (top-end)' },
    { value: 'left-start', label: '左对齐 (left-start)' }, { value: 'left', label: '左侧 (left)' }, { value: 'left-end', label: '左下对齐 (left-end)' },
    { value: 'right-start', label: '右对齐 (right-start)' }, { value: 'right', label: '右侧 (right)' }, { value: 'right-end', label: '右下对齐 (right-end)' },
  ]},
  { key: 'offset', label: '偏移距离', type: 'slider', min: 0, max: 24 },
  { key: 'matchWidth', label: '匹配宽度', description: '菜单宽度与触发元素一致', type: 'switch' },
  { key: 'menuWidth', label: '菜单宽度', type: 'input', placeholder: '如: 200px' },
  { key: 'menuMaxWidth', label: '最大宽度', type: 'input', placeholder: '如: 320px' },
  { key: 'teleport', label: '传送至 body', description: '将菜单渲染到 body 元素下', type: 'switch' },
]

// ---- FloatingBall ----
const ballPrefs = ref<FloatingBallPrefs>({ theme: 'light', shrunk: false, hidden: false, label: 'FB' })
const showBall = ref(false)
const ballSchema: PropPanelSchemaItem[] = [
  { key: 'theme', label: '主题', type: 'segmented', options: [{ value: 'light', label: '亮色' }, { value: 'dark', label: '暗色' }] },
  { key: 'label', label: '标签文字', type: 'input', placeholder: '悬浮球内文字' },
  { key: 'shrunk', label: '缩小', description: '切换更小的悬浮球尺寸', type: 'switch' },
  { key: 'hidden', label: '隐藏', description: '完全隐藏悬浮球', type: 'switch' },
]

// ---- AxImage ----
const imageProps = ref({
  src: 'https://picsum.photos/seed/ax-demo/600/400', alt: '示例图片',
  objectFit: 'cover' as 'cover' | 'contain', adaptiveAspect: false,
})
const imageSchema: PropPanelSchemaItem[] = [
  { key: 'src', label: '图片 URL', type: 'input', placeholder: 'https://...' },
  { key: 'alt', label: '替代文字', type: 'input', placeholder: '图片描述' },
  { key: 'objectFit', label: '填充模式', type: 'segmented', options: [{ value: 'cover', label: 'Cover' }, { value: 'contain', label: 'Contain' }] },
  { key: 'adaptiveAspect', label: '自适应宽高比', description: '加载前正方形占位', type: 'switch' },
]

// ---- AxJsonViewer ----
const jsonViewerProps = ref({ expandLevel: 0, wrapEnabled: true })
const sampleJson = {
  name: 'WorkBuddy', version: '2.4.0',
  description: 'WorkBuddy 是一款强大的 AI 编程助手，支持代码生成、智能问答、项目分析、自动化任务、多模态内容理解等多种功能。',
  modules: ['core', 'ui', 'connector', 'plugin-system', 'task-scheduler'],
  dependencies: { production: { vue: '^3.5.0', typescript: '^5.7.0' }, dev: { vitest: '^2.1.0' } },
  settings: { theme: 'auto', language: 'zh-CN', features: { ai: true, automation: true } },
  stats: { users: 12800, uptime: 99.98, active: true, avgResponseMs: 120 },
  config: null, tags: ['vue', 'typescript', 'ai'],
}
const jsonViewerSchema: PropPanelSchemaItem[] = [
  { key: 'expandLevel', label: '展开级别', description: '-1=全部折叠  0=全部展开  1=第一层  2/3=更深层级', type: 'slider', min: -1, max: 3, step: 1 },
  { key: 'wrapEnabled', label: '自动换行', description: '长文本自动换行而非截断', type: 'switch' },
]

// ---- AxImageViewer ----
const showImageViewer = ref(false)
const demoImages = [
  'https://picsum.photos/seed/viewer1/1200/800',
  'https://picsum.photos/seed/viewer2/1200/800',
  'https://picsum.photos/seed/viewer3/1200/800',
  'https://picsum.photos/seed/viewer4/1200/800',
  'https://picsum.photos/seed/viewer5/1200/800',
]

// ---- Notify ----
const notify = useNotify()
const notifyProps = ref({ type: 'info' as 'info' | 'success' | 'error' | 'secondary', title: '通知气泡', message: '核心集群控制链已就绪，当前各项数据运行处于标准健康状态。', showActions: false })
const notifySchema: PropPanelSchemaItem[] = [
  { key: 'type', label: '类型', type: 'segmented', options: [{ value: 'info', label: 'Info' }, { value: 'success', label: 'Success' }, { value: 'error', label: 'Error' }, { value: 'secondary', label: 'Secondary' }] },
  { key: 'title', label: '标题', type: 'input', placeholder: '通知标题' },
  { key: 'message', label: '消息内容', type: 'textarea', placeholder: '通知内容', rows: 3 },
  { key: 'showActions', label: '显示操作区', description: '展示角标数量和日志统计', type: 'switch' },
]

function handleNotifyShow() {
  notify.triggerNotify(notifyProps.value.message, notifyProps.value.type, notifyProps.value.title)
}
function handleBallSave(prefs: FloatingBallPrefs) {
  ballPrefs.value = prefs
}
</script>

<template>
  <div class="ax-space-y-lg">
    <div class="ax-border-b" style="padding-bottom: 1rem">
      <h2 class="ax-text-headline-sm ax-color-primary" style="font-size: 20px; line-height: 28px">UI 组件列表</h2>
      <p class="ax-text-body-sm ax-color-on-surface-variant" style="margin-top: 0.25rem">展示所有组件的每一种状态变体。左侧预览区，右侧属性配置面板，实时联动。</p>
    </div>

    <!-- Button -->
    <div id="section-btn" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">Button</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">按钮组件 — 支持 4 种变体、3 种尺寸、图标、加载态、禁用态</span>
      </div>
      <div class="ax-flex" style="min-height: 200px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-flex-col ax-gap-lg ax-items-start ax-justify-center" style="padding: 1.5rem">
          <div class="ax-flex ax-flex-wrap ax-items-center ax-gap-sm">
            <AxButton :variant="btnProps.variant" :size="btnProps.size" :rounded="btnProps.rounded" :disabled="btnProps.disabled"
              :icon="btnProps.showIcon ? 'bolt' : ''" :block="btnProps.block" :loading="btnProps.loading">
              {{ btnProps.label }}
            </AxButton>
          </div>
          <div class="ax-flex ax-flex-wrap ax-gap-xs">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px; margin-right: 0.25rem">所有变体：</span>
            <AxButton variant="primary" size="sm">Primary</AxButton>
            <AxButton variant="outline" size="sm">Outline</AxButton>
            <AxButton variant="ghost" size="sm">Ghost</AxButton>
            <AxButton variant="danger" size="sm">Danger</AxButton>
            <AxButton variant="primary" size="sm" icon="bolt">带图标</AxButton>
            <AxButton variant="primary" size="icon" icon="settings" />
            <AxButton variant="outline" size="sm" disabled>禁用</AxButton>
          </div>
        </div>
        <div class="ax-bg-surface-container-lowest" style="width: 336px; padding: 1rem; overflow-y: auto">
          <AxPropPanel v-model="btnProps" :schema="btnSchema" title="按钮属性" />
        </div>
      </div>
    </div>

    <!-- Input -->
    <div id="section-input" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">Input</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">输入框 — 支持单行/多行切换、3 种尺寸、前缀图标、密码模式、禁用态</span>
      </div>
      <div class="ax-flex" style="min-height: 260px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-flex-col ax-gap-md ax-items-start ax-justify-center" style="padding: 1.5rem">
          <form class="ax-flex ax-flex-col ax-gap-md ax-items-start" autocomplete="off" @submit.prevent style="position: relative">
            <div style="position: relative">
              <input v-if="inputProps.showPassword" type="text" name="username" autocomplete="username" tabindex="-1" aria-hidden="true"
                style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0">
              <AxInput v-model="inputProps.value" :size="inputProps.size" :rounded="inputProps.rounded" :placeholder="inputProps.placeholder"
                :disabled="inputProps.disabled" :password="inputProps.showPassword && !inputProps.showMultiline"
                :multiline="inputProps.showMultiline" :rows="inputProps.inputRows" :resize="inputProps.resize" style="width: 16rem">
                <template v-if="inputProps.showPrefix && !inputProps.showMultiline && !inputProps.showPassword" #prefix>
                  <AxIcon name="search" :size="16" />
                </template>
                <template v-if="inputProps.showSuffix && !inputProps.showMultiline && !inputProps.showPassword" #suffix>
                  <AxIcon name="close" :size="16" />
                </template>
              </AxInput>
            </div>
          </form>
          <div class="ax-flex ax-flex-wrap ax-gap-sm">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px; align-self: center">所有尺寸：</span>
            <AxInput size="sm" placeholder="Small" class="w-28" />
            <AxInput size="md" placeholder="Medium" class="w-28" />
            <AxInput size="lg" placeholder="Large" class="w-28" />
          </div>
          <div class="ax-flex ax-flex-wrap ax-gap-sm">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px; align-self: center">带图标：</span>
            <AxInput size="lg" placeholder="带前缀" class="w-40">
              <template #prefix><AxIcon name="search" :size="16" /></template>
            </AxInput>
            <AxInput size="lg" placeholder="带后缀" class="w-40">
              <template #suffix><AxIcon name="close" :size="16" /></template>
            </AxInput>
            <AxInput size="lg" placeholder="禁用状态" class="w-36" disabled />
          </div>
          <form class="ax-flex ax-flex-wrap ax-gap-sm ax-items-center" autocomplete="off" @submit.prevent style="position: relative">
            <input type="text" name="username" autocomplete="username" tabindex="-1" aria-hidden="true"
              style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px; align-self: center">密码模式：</span>
            <AxInput size="lg" placeholder="请输入密码" class="w-44" password />
            <AxInput size="lg" placeholder="密码已输入" class="w-44" password model-value="Admin@2026" autocomplete="current-password" />
          </form>
        </div>
        <div class="ax-bg-surface-container-lowest" style="width: 336px; padding: 1rem; overflow-y: auto">
          <AxPropPanel v-model="inputProps" :schema="inputSchema" title="输入框属性" />
        </div>
      </div>
    </div>

    <!-- Slider -->
    <div id="section-slider" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">Slider</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">滑块组件 — 支持自定义范围、标签、数值显示</span>
      </div>
      <div class="ax-flex" style="min-height: 180px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-flex-col ax-gap-lg ax-items-start ax-justify-center" style="padding: 1.5rem">
          <div style="width: 18rem">
            <AxSlider v-model="sliderProps.value" :min="sliderProps.min" :max="sliderProps.max"
              :show-labels="sliderProps.showLabels" :show-value="sliderProps.showValue"
              :label-position="sliderProps.labelPosition" label-left="最小" label-right="最大"
              :value-label="sliderProps.value + '%'" />
          </div>
          <div class="ax-space-y-sm" style="width: 100%; max-width: 24rem">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">带标签与数值：</span>
            <AxSlider :model-value="72" :min="0" :max="100" show-labels show-value label-left="空载" label-right="满载" value-label="72%" />
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">标签右侧模式：</span>
            <AxSlider :model-value="72" :min="0" :max="100" show-labels show-value label-left="空载" label-right="满载" value-label="72%" label-position="right" />
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">无标签简洁模式：</span>
            <AxSlider :model-value="40" :min="0" :max="100" />
          </div>
        </div>
        <div class="ax-bg-surface-container-lowest" style="width: 336px; padding: 1rem; overflow-y: auto">
          <AxPropPanel v-model="sliderProps" :schema="sliderSchema" title="滑块属性" />
        </div>
      </div>
    </div>

    <!-- Switch -->
    <div id="section-switch" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">Switch</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">开关组件 — 支持 v-model、禁用态、aria 可访问性</span>
      </div>
      <div class="ax-flex" style="min-height: 180px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-flex-col ax-gap-lg ax-items-start ax-justify-center" style="padding: 1.5rem">
          <div class="ax-flex ax-items-center ax-gap-md">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">动态预览：</span>
            <AxSwitch :model-value="switchProps.checked" :disabled="switchProps.disabled" :size="switchProps.size"
              @update:model-value="switchProps.checked = $event" />
            <span class="ax-text-body-sm ax-color-primary" style="font-size: 12px; margin-left: 0.5rem">{{ switchProps.checked ? '开启' : '关闭' }}</span>
          </div>
          <div class="ax-space-y-sm" style="width: 100%; max-width: 24rem">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">所有状态：</span>
            <div class="ax-flex ax-flex-wrap ax-items-center ax-gap-md">
              <div class="ax-flex ax-items-center ax-gap-sm">
                <AxSwitch :model-value="true" />
                <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">开启</span>
              </div>
              <div class="ax-flex ax-items-center ax-gap-sm">
                <AxSwitch :model-value="false" />
                <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">关闭</span>
              </div>
              <div class="ax-flex ax-items-center ax-gap-sm">
                <AxSwitch :model-value="true" disabled />
                <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">禁用-开</span>
              </div>
              <div class="ax-flex ax-items-center ax-gap-sm">
                <AxSwitch :model-value="false" disabled />
                <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">禁用-关</span>
              </div>
            </div>
          </div>
        </div>
        <div class="ax-bg-surface-container-lowest" style="width: 336px; padding: 1rem; overflow-y: auto">
          <AxPropPanel v-model="switchProps" :schema="switchSchema" title="开关属性" />
        </div>
      </div>
    </div>

    <!-- Alert -->
    <div id="section-alert" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">Alert</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">警示横幅 — 4 种语义、可关闭、带标题</span>
      </div>
      <div class="ax-flex" style="min-height: 180px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-flex-col ax-gap-sm ax-items-start ax-justify-center" style="padding: 1.5rem">
          <AxAlert :type="alertProps.type" :title="alertProps.title" :dismissible="alertProps.dismissible" model-value>
            {{ alertProps.message }}</AxAlert>
          <div class="ax-space-y-xs" style="width: 100%; max-width: 28rem; margin-top: 0.5rem">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">所有类型：</span>
            <AxAlert type="info" title="信息" model-value :dismissible="false">这是一条系统信息提示。</AxAlert>
            <AxAlert type="success" title="成功" model-value :dismissible="false">操作已成功完成。</AxAlert>
            <AxAlert type="warning" title="警告" model-value :dismissible="false">请注意当前系统资源使用情况。</AxAlert>
            <AxAlert type="error" title="错误" model-value :dismissible="false">核心服务连接已中断。</AxAlert>
          </div>
        </div>
        <div class="ax-bg-surface-container-lowest" style="width: 336px; padding: 1rem; overflow-y: auto">
          <AxPropPanel v-model="alertProps" :schema="alertSchema" title="警示属性" />
        </div>
      </div>
    </div>

    <!-- Select -->
    <div id="section-select" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">Select</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">自定义下拉选择 — 支持搜索过滤</span>
      </div>
      <div class="ax-flex" style="min-height: 180px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-flex-col ax-gap-lg ax-items-start ax-justify-center" style="padding: 1.5rem">
          <div>
            <AxSelect v-model="selectProps.value" :size="selectProps.size" :rounded="selectProps.rounded" :options="demoSelectOptions"
              :searchable="selectProps.searchable" :multiple="selectProps.multiple"
              :placeholder="selectProps.placeholder" :placement="selectProps.placement"
              :dropdown-width="selectProps.dropdownWidth" :dropdown-max-width="selectProps.dropdownMaxWidth"
              :tag-max-width="selectProps.tagMaxWidth" :trigger-width="selectProps.triggerWidth"
              :trigger-max-width="selectProps.triggerMaxWidth" />
          </div>
          <div class="ax-flex ax-items-center ax-gap-sm">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">带搜索的选择器：</span>
            <AxSelect model-value="opt2" :options="demoSelectOptions" searchable placeholder="选择框架..." />
          </div>
        </div>
        <div class="ax-bg-surface-container-lowest" style="width: 336px; padding: 1rem; overflow-y: auto">
          <AxPropPanel v-model="selectProps" :schema="selectSchema" title="下拉选择属性" />
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <div id="section-tooltip" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">Tooltip</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">悬停提示气泡 — 8 个方向，Floating UI 精准定位</span>
      </div>
      <div class="ax-flex" style="min-height: 180px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-flex-col ax-gap-lg ax-items-center ax-justify-center" style="padding: 1.5rem">
          <AxTooltip :content="tooltipProps.content" :placement="tooltipProps.placement" :arrow="tooltipProps.arrow"
            :offset="tooltipProps.offset">
            <AxButton variant="outline">悬停此处查看效果</AxButton>
          </AxTooltip>
          <div class="ax-flex ax-flex-wrap ax-gap-sm ax-justify-center">
            <AxTooltip content="top 提示" placement="top"><AxButton variant="ghost" size="sm">上方</AxButton></AxTooltip>
            <AxTooltip content="bottom 提示" placement="bottom"><AxButton variant="ghost" size="sm">下方</AxButton></AxTooltip>
            <AxTooltip content="left 提示" placement="left"><AxButton variant="ghost" size="sm">左侧</AxButton></AxTooltip>
            <AxTooltip content="right 提示" placement="right"><AxButton variant="ghost" size="sm">右侧</AxButton></AxTooltip>
            <AxTooltip content="top-start 提示" placement="top-start"><AxButton variant="ghost" size="sm">左上角</AxButton></AxTooltip>
            <AxTooltip content="top-end 提示" placement="top-end"><AxButton variant="ghost" size="sm">右上角</AxButton></AxTooltip>
          </div>
        </div>
        <div class="ax-bg-surface-container-lowest" style="width: 336px; padding: 1rem; overflow-y: auto">
          <AxPropPanel v-model="tooltipProps" :schema="tooltipSchema" title="气泡属性" />
        </div>
      </div>
    </div>

    <!-- Dropdown -->
    <div id="section-dropdown" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">Dropdown</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">上下文菜单 — 任意 Slot 内容，Floating UI 定位</span>
      </div>
      <div class="ax-flex" style="min-height: 180px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-items-center ax-justify-center" style="padding: 1.5rem; gap: 2rem">
          <div class="ax-flex ax-flex-col ax-items-center ax-gap-sm">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">功能菜单</span>
            <AxDropdown v-model="showDropdownDemo1" :trigger="dropdownProps.trigger"
              :placement="dropdownProps.placement" :offset="dropdownProps.offset"
              :match-width="dropdownProps.matchWidth" :menu-width="dropdownProps.menuWidth"
              :menu-max-width="dropdownProps.menuMaxWidth" :teleport="dropdownProps.teleport"
              :menu-class="dropdownProps.menuWidth || dropdownProps.matchWidth ? '' : 'w-44'">
              <template #trigger>
                <AxButton>打开菜单<template #suffix><AxIcon name="expand_more" :size="16" /></template></AxButton>
              </template>
              <template #default="{ close }">
                <div class="ax-dropdown__body">
                  <button class="ax-dropdown__item" @click="close()"><AxIcon name="download" :size="16" /><span>导出配置</span></button>
                  <button class="ax-dropdown__item" @click="close()"><AxIcon name="edit" :size="16" /><span>编辑设置</span></button>
                  <div class="ax-dropdown__divider" />
                  <button class="ax-dropdown__item ax-dropdown__item--danger" @click="close()"><AxIcon name="delete" :size="16" /><span>删除</span></button>
                </div>
              </template>
            </AxDropdown>
          </div>
          <div class="ax-flex ax-flex-col ax-items-center ax-gap-sm">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">图标按钮触发</span>
            <AxDropdown v-model="showDropdownDemo2" placement="bottom-end" menu-class="w-40">
              <template #trigger>
                <AxButton variant="outline" size="icon"><AxIcon name="more_vert" :size="16" /></AxButton>
              </template>
              <template #default="{ close }">
                <div class="ax-dropdown__body">
                  <button class="ax-dropdown__item" @click="close()"><AxIcon name="info" :size="16" /><span>查看详情</span></button>
                  <button class="ax-dropdown__item" @click="close()"><AxIcon name="settings" :size="16" /><span>分享链接</span></button>
                </div>
              </template>
            </AxDropdown>
          </div>
        </div>
        <div class="ax-bg-surface-container-lowest" style="width: 336px; padding: 1rem; overflow-y: auto">
          <AxPropPanel v-model="dropdownProps" :schema="dropdownSchema" title="下拉菜单属性" />
        </div>
      </div>
    </div>

    <!-- Popover -->
    <div id="section-popover" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">Popover</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">通用浮层容器 — 支持 click/hover/contextmenu 三种触发，内容完全由 Slot 自定义</span>
      </div>
      <div class="ax-flex" style="min-height: 220px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-items-center ax-justify-center" style="padding: 1.5rem; gap: 2rem">
          <!-- 通知卡片 (click) -->
          <div class="ax-flex ax-flex-col ax-items-center ax-gap-sm">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">通知卡片</span>
            <AxDropdown v-model="showPopoverDemo1" :trigger="popoverProps.trigger" :placement="popoverProps.placement"
              :offset="popoverProps.offset" :teleport="popoverProps.teleport"
              :menu-width="popoverProps.width || undefined" :menu-max-width="popoverProps.maxWidth || undefined"
              :panel-class="popoverProps.width ? 'p-0' : 'p-0 w-64'">
              <template #trigger>
                <AxButton variant="outline">
                  <template #prefix><AxIcon name="settings" :size="16" /></template>
                  查看通知
                </AxButton>
              </template>
              <template #default="{ close }">
                <div class="ax-card__header">
                  <div class="ax-flex ax-items-center ax-gap-sm">
                    <AxIcon :name="popoverProps.icon" :size="16" class="ax-color-primary" />
                    <span class="ax-color-primary" style="font-size: 13px; font-weight: 600">{{ popoverProps.title }}</span>
                  </div>
                  <button class="ax-dialog__close" @click="close()"><AxIcon name="close" :size="14" /></button>
                </div>
                <div class="ax-card__body ax-space-y-sm">
                  <div class="ax-flex ax-items-start ax-gap-sm ax-bg-surface-container-low ax-rounded-lg" style="padding: 0.5rem">
                    <AxIcon name="info" :size="16" class="ax-color-primary" style="margin-top: 0.125rem" />
                    <div style="min-width: 0">
                      <p class="ax-text-body-sm ax-color-primary" style="font-size: 12px; font-weight: 600">系统更新 v2.4.0</p>
                      <p class="ax-text-body-sm ax-color-secondary" style="font-size: 11px; line-height: 1.6">新增 Popover 组件，支持富内容展示。</p>
                    </div>
                  </div>
                  <button class="ax-button ax-button--md ax-button--outline ax-button--block ax-rounded-md" style="font-family: var(--ax-font-label-md); font-size: var(--ax-text-label-md-size)" @click="close()">查看全部通知</button>
                </div>
              </template>
            </AxDropdown>
          </div>

          <!-- 悬停触发 -->
          <div class="ax-flex ax-flex-col ax-items-center ax-gap-sm">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">悬停触发</span>
            <AxDropdown v-model="showPopoverDemo2" trigger="hover" placement="bottom" panel-class="p-ax-md">
              <template #trigger><AxButton variant="outline" size="sm">悬停此处</AxButton></template>
              <template #default="{ close }">
                <div class="ax-space-y-sm" style="width: 12rem">
                  <p class="ax-text-body-sm ax-color-on-surface-variant" style="font-size: 12px; line-height: 1.6">鼠标悬停即可展示。移入面板后不会关闭。</p>
                  <div class="ax-flex ax-gap-xs ax-justify-end">
                    <AxButton variant="outline" size="sm" @click="close()">知道了</AxButton>
                  </div>
                </div>
              </template>
            </AxDropdown>
          </div>

          <!-- 右键菜单 -->
          <div class="ax-flex ax-flex-col ax-items-center ax-gap-sm">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">右键菜单 (AxDropdown)</span>
            <AxDropdown v-model="showPopoverDemo3" trigger="contextmenu" placement="bottom-start" panel-class="p-0.5">
              <template #trigger>
                <div class="ax-flex ax-items-center ax-gap-sm ax-border ax-rounded-lg ax-color-secondary" style="padding: 0.5rem 1rem; border-style: dashed; cursor: context-menu; user-select: none; font-size: 11px">
                  <AxIcon name="settings" :size="16" />
                  <span>在此区域右键点击</span>
                </div>
              </template>
              <template #default="{ close }">
                <div class="ax-dropdown__body" style="width: 11rem">
                  <button class="ax-dropdown__item" @click="close()"><AxIcon name="arrow_back" :size="16" /><span>向后</span></button>
                  <button class="ax-dropdown__item" style="opacity: 0.4; pointer-events: none"><AxIcon name="settings" :size="16" /><span>向前</span></button>
                  <button class="ax-dropdown__item" @click="close()"><AxIcon name="refresh" :size="16" /><span>重新加载</span></button>
                  <div class="ax-dropdown__divider" />
                  <button class="ax-dropdown__item" @click="close()"><AxIcon name="download" :size="16" /><span>另存为...</span></button>
                  <div class="ax-dropdown__divider" />
                  <button class="ax-dropdown__item" @click="close()"><AxIcon name="search" :size="16" /><span>打印...</span></button>
                </div>
              </template>
            </AxDropdown>
          </div>
        </div>
        <div class="ax-bg-surface-container-lowest" style="width: 336px; padding: 1rem; overflow-y: auto">
          <AxPropPanel v-model="popoverProps" :schema="popoverSchema" title="气泡卡片属性" />
        </div>
      </div>
    </div>

    <!-- Dialog -->
    <div id="section-dialog" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">Dialog</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">模态弹窗 — 焦点陷阱、ESC 关闭、遮罩关闭</span>
      </div>
      <div class="ax-flex" style="min-height: 180px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-flex-col ax-gap-md ax-items-center ax-justify-center" style="padding: 1.5rem">
          <div class="ax-flex ax-gap-sm ax-flex-wrap ax-justify-center">
            <AxButton @click="emit('open-dialog')">打开确认对话框</AxButton>
            <AxButton variant="outline" @click="emit('open-simple-dialog')">打开简单提示框</AxButton>
          </div>
          <p class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">点击上方按钮打开对话框，可通过 ESC 键或点击遮罩关闭。</p>
        </div>
        <div class="ax-bg-surface-container-lowest ax-flex ax-items-center" style="width: 336px; padding: 1rem; overflow-y: auto">
          <p class="ax-text-body-sm ax-color-secondary" style="font-size: 11px; line-height: 1.6">
            Dialog 支持 <code class="ax-bg-surface-container ax-rounded-sm ax-color-primary" style="padding: 0 0.25rem">#header</code>、
            <code class="ax-bg-surface-container ax-rounded-sm ax-color-primary" style="padding: 0 0.25rem">#default</code>、
            <code class="ax-bg-surface-container ax-rounded-sm ax-color-primary" style="padding: 0 0.25rem">#footer</code> 三个插槽。
          </p>
        </div>
      </div>
    </div>

    <!-- Notify -->
    <div id="section-notify" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">Notify</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">通知气泡 — 4 种语义、自动关闭、关闭按钮、日志记录</span>
      </div>
      <div class="ax-flex" style="min-height: 320px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-flex-col ax-gap-lg ax-items-start ax-justify-center" style="padding: 1.5rem">
          <div class="ax-space-y-sm" style="width: 100%">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">所有类型静态预览：</span>
            <div class="ax-card ax-flex ax-items-start ax-gap-sm" style="width: 20rem; padding: 1rem; text-align: left">
              <AxIcon name="info" :size="18" class="ax-color-primary" style="margin-top: 0.125rem" />
              <div class="ax-flex-1">
                <h4 class="ax-color-primary" style="font-size: 14px; font-weight: 600; margin-bottom: 0.125rem">信息通知</h4>
                <p class="ax-text-body-sm ax-color-on-surface-variant" style="line-height: 1.5">系统服务已启动，运行状态正常。</p>
              </div>
              <button class="ax-dialog__close" style="width: 1.5rem; height: 1.5rem"><AxIcon name="close" :size="16" /></button>
            </div>
            <div class="ax-card ax-flex ax-items-start ax-gap-sm" style="width: 20rem; padding: 1rem; text-align: left">
              <AxIcon name="check_circle" :size="18" class="ax-color-primary" style="margin-top: 0.125rem" />
              <div class="ax-flex-1">
                <h4 class="ax-color-primary" style="font-size: 14px; font-weight: 600; margin-bottom: 0.125rem">操作成功</h4>
                <p class="ax-text-body-sm ax-color-on-surface-variant" style="line-height: 1.5">配置已成功保存至云端。</p>
              </div>
              <button class="ax-dialog__close" style="width: 1.5rem; height: 1.5rem"><AxIcon name="close" :size="16" /></button>
            </div>
            <div class="ax-card ax-flex ax-items-start ax-gap-sm" style="width: 20rem; padding: 1rem; text-align: left">
              <AxIcon name="error" :size="18" class="ax-color-error" style="margin-top: 0.125rem" />
              <div class="ax-flex-1">
                <h4 class="ax-color-primary" style="font-size: 14px; font-weight: 600; margin-bottom: 0.125rem">连接中断</h4>
                <p class="ax-text-body-sm ax-color-on-surface-variant" style="line-height: 1.5">核心服务连接已断开，请检查网络后重试。</p>
              </div>
              <button class="ax-dialog__close" style="width: 1.5rem; height: 1.5rem"><AxIcon name="close" :size="16" /></button>
            </div>
            <div class="ax-card ax-flex ax-items-start ax-gap-sm" style="width: 20rem; padding: 1rem; text-align: left">
              <AxIcon name="settings" :size="18" class="ax-color-secondary" style="margin-top: 0.125rem" />
              <div class="ax-flex-1">
                <h4 class="ax-color-primary" style="font-size: 14px; font-weight: 600; margin-bottom: 0.125rem">系统设置</h4>
                <p class="ax-text-body-sm ax-color-on-surface-variant" style="line-height: 1.5">数据缓存清理完毕，释放空间 12.8 MB。</p>
              </div>
              <button class="ax-dialog__close" style="width: 1.5rem; height: 1.5rem"><AxIcon name="close" :size="16" /></button>
            </div>
          </div>

          <div class="ax-flex ax-items-center ax-gap-md">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px; align-self: center">动态触发：</span>
            <AxButton size="sm" @click="handleNotifyShow">
              <template #prefix><AxIcon name="settings" :size="16" /></template>
              发送通知
            </AxButton>
          </div>

          <div v-if="notifyProps.showActions" class="ax-flex ax-flex-wrap ax-gap-md" style="width: 100%; max-width: 28rem">
            <div class="ax-flex ax-items-center ax-gap-sm ax-bg-surface-container-low ax-rounded-lg" style="padding: 0.5rem 0.75rem">
              <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">活跃通知数：</span>
              <span class="ax-color-primary" style="font-size: 14px">{{ notify.activeNotificationCount }}</span>
            </div>
            <AxButton variant="outline" size="sm" @click="notify.clearLogs()">
              <template #prefix><AxIcon name="delete" :size="16" /></template>
              清空日志
            </AxButton>
          </div>
          <p class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">通知 4 秒后自动关闭，也可点 × 手动关闭。基于 <code class="ax-bg-surface-container ax-rounded-sm ax-color-primary" style="padding: 0 0.25rem">vue-sonner</code>。</p>
        </div>
        <div class="ax-bg-surface-container-lowest" style="width: 336px; padding: 1rem; overflow-y: auto">
          <AxPropPanel v-model="notifyProps" :schema="notifySchema" title="通知属性" />
        </div>
      </div>
    </div>

    <!-- FloatingBall -->
    <div id="section-floating-ball" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">FloatingBall</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">可拖拽悬浮球 — 支持贴边、展开菜单、亮暗主题、缩小模式</span>
      </div>
      <div class="ax-flex" style="min-height: 280px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-flex-col ax-gap-md ax-items-center ax-justify-center" style="padding: 1.5rem">
          <div class="ax-flex ax-flex-wrap ax-items-center" style="gap: 2rem">
            <div class="ax-flex ax-flex-col ax-items-center ax-gap-sm">
              <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">标准尺寸</span>
              <div class="ax-flex ax-items-center ax-justify-center ax-rounded-full" style="width: 36px; height: 36px; background: #fff; box-shadow: var(--ax-shadow-pro); border: 1px solid rgba(0,0,0,0.08)">
                <span class="ax-flex ax-items-center ax-justify-center ax-rounded-full" style="width: 30px; height: 30px; background: linear-gradient(to bottom right, var(--ax-color-ball-light), var(--ax-color-ball)); color: #fff; box-shadow: 0 1px 3px rgba(99,102,241,0.4)">
                  <span style="font-size: 11px; font-weight: 800; font-style: italic; color: #fff">{{ ballPrefs.label || 'FB' }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="ax-flex ax-gap-sm" style="margin-top: 1rem">
            <button class="ax-button ax-button--md ax-button--primary ax-rounded-md" @click="showBall = !showBall">
              {{ showBall ? '隐藏页面悬浮球' : '在页面上展示悬浮球' }}
            </button>
          </div>
          <p class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">点击上方按钮将悬浮球渲染到页面中（固定定位，可在右下角找到）。</p>
        </div>
        <div class="ax-bg-surface-container-lowest" style="width: 336px; padding: 1rem; overflow-y: auto">
          <AxPropPanel v-model="ballPrefs" :schema="ballSchema" title="悬浮球属性" />
        </div>
      </div>
    </div>

    <!-- AxImage -->
    <div id="section-image" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">Image</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">懒加载图片 — 加载/成功/失败三态、点击放大预览、hover 图标、自适应宽高比</span>
      </div>
      <div class="ax-flex" style="min-height: 340px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-flex-col ax-gap-md ax-items-start ax-justify-center" style="padding: 1.5rem">
          <div class="ax-flex ax-flex-wrap ax-items-start" style="gap: 2rem">
            <div class="ax-flex ax-flex-col ax-items-center ax-gap-sm">
              <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">动态预览</span>
              <div class="ax-rounded-lg ax-border" style="width: 14rem; height: 10rem; overflow: hidden">
                <AxImage :src="imageProps.src" :alt="imageProps.alt" :object-fit="imageProps.objectFit"
                  :adaptive-aspect="imageProps.adaptiveAspect" />
              </div>
            </div>
            <div class="ax-flex ax-flex-col ax-gap-sm">
              <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">各种状态：</span>
              <div class="ax-flex ax-gap-sm ax-flex-wrap">
                <div class="ax-flex ax-flex-col ax-items-center ax-gap-xs">
                  <div class="ax-rounded-lg ax-border" style="width: 7rem; height: 5rem; overflow: hidden">
                    <AxImage src="https://picsum.photos/seed/normal/320/240" alt="正常" />
                  </div>
                  <span class="ax-text-body-sm ax-color-outline" style="font-size: 10px">正常加载</span>
                </div>
                <div class="ax-flex ax-flex-col ax-items-center ax-gap-xs">
                  <div class="ax-rounded-lg ax-border" style="width: 7rem; height: 5rem; overflow: hidden">
                    <AxImage src="https://invalid.example/404.jpg" alt="失败" />
                  </div>
                  <span class="ax-text-body-sm ax-color-outline" style="font-size: 10px">加载失败（可重试）</span>
                </div>
                <div class="ax-flex ax-flex-col ax-items-center ax-gap-xs">
                  <div class="ax-rounded-lg ax-border" style="width: 7rem; height: 5rem; overflow: hidden">
                    <AxImage src="https://picsum.photos/seed/contain/320/240" alt="Contain" object-fit="contain" />
                  </div>
                  <span class="ax-text-body-sm ax-color-outline" style="font-size: 10px">Contain 模式</span>
                </div>
              </div>
            </div>
          </div>
          <p class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">点击已加载图片触发 <code class="ax-bg-surface-container ax-rounded-sm ax-color-primary" style="padding: 0 0.25rem">preview</code> 事件（可接入 ImageViewer 放大浏览）。</p>
        </div>
        <div class="ax-bg-surface-container-lowest" style="width: 336px; padding: 1rem; overflow-y: auto">
          <AxPropPanel v-model="imageProps" :schema="imageSchema" title="图片属性" />
        </div>
      </div>
    </div>

    <!-- AxJsonViewer -->
    <div id="section-json-viewer" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">JsonViewer</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">可折叠 JSON 树查看器 — 递归展开/折叠、Ctrl+点击深层切换、语法高亮</span>
      </div>
      <div class="ax-flex" style="min-height: 360px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-flex-col ax-gap-sm ax-items-start ax-justify-center" style="padding: 1.5rem">
          <div class="ax-bg-surface-container-low ax-border ax-rounded-lg" style="width: 100%; max-width: 32rem; padding: 1rem">
            <AxJsonViewer :data="sampleJson" :expand-level="jsonViewerProps.expandLevel"
              :wrap-enabled="jsonViewerProps.wrapEnabled" is-root />
          </div>
          <p class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">点击箭头展开/折叠节点，<kbd class="ax-text-label-md ax-bg-surface-container ax-border ax-rounded-sm ax-color-primary" style="font-size: 10px; padding: 0 0.25rem">Ctrl</kbd> + 点击递归展开/折叠所有子节点。</p>
        </div>
        <div class="ax-bg-surface-container-lowest" style="width: 336px; padding: 1rem; overflow-y: auto">
          <AxPropPanel v-model="jsonViewerProps" :schema="jsonViewerSchema" title="JSON属性" />
        </div>
      </div>
    </div>

    <!-- AxImageViewer -->
    <div id="section-image-viewer" class="ax-card scroll-mt-4">
      <div class="ax-card__header">
        <span class="ax-card__header-title">ImageViewer</span>
        <span class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">全屏图片查看器 — 缩放/旋转/翻转/键盘快捷键/下载</span>
      </div>
      <div class="ax-flex" style="min-height: 260px">
        <div class="ax-flex-1 ax-comp-preview ax-flex ax-flex-col ax-gap-lg ax-items-center ax-justify-center" style="padding: 1.5rem">
          <div class="ax-flex ax-flex-wrap ax-items-center" style="gap: 1.5rem">
            <div class="ax-flex ax-flex-col ax-items-center ax-gap-sm">
              <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">点击打开查看器</span>
              <AxButton variant="primary" icon="settings" @click="showImageViewer = true">
                浏览 {{ demoImages.length }} 张图片
              </AxButton>
            </div>
            <div class="ax-flex" style="margin-left: -0.5rem">
              <img v-for="(img, i) in demoImages.slice(0, 4)" :key="i" :src="img"
                class="ax-border" style="width: 3.5rem; height: 2.5rem; border-radius: 6px; border-width: 2px; object-fit: cover; box-shadow: 0 1px 3px rgba(0,0,0,0.1)"
                :style="{ zIndex: demoImages.length - i, marginLeft: i > 0 ? '-0.5rem' : '0' }" />
            </div>
          </div>
          <div class="ax-flex ax-flex-wrap ax-gap-sm" style="text-align: center">
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">键盘快捷键：</span>
            <kbd class="ax-text-label-md ax-bg-surface-container ax-border ax-rounded-sm ax-color-primary" style="font-size: 10px; padding: 0 0.375rem">← →</kbd><span class="ax-text-body-sm ax-color-outline" style="font-size: 10px">切换</span>
            <kbd class="ax-text-label-md ax-bg-surface-container ax-border ax-rounded-sm ax-color-primary" style="font-size: 10px; padding: 0 0.375rem">+ -</kbd><span class="ax-text-body-sm ax-color-outline" style="font-size: 10px">缩放</span>
            <kbd class="ax-text-label-md ax-bg-surface-container ax-border ax-rounded-sm ax-color-primary" style="font-size: 10px; padding: 0 0.375rem">R</kbd><span class="ax-text-body-sm ax-color-outline" style="font-size: 10px">旋转</span>
            <kbd class="ax-text-label-md ax-bg-surface-container ax-border ax-rounded-sm ax-color-primary" style="font-size: 10px; padding: 0 0.375rem">F</kbd><span class="ax-text-body-sm ax-color-outline" style="font-size: 10px">翻转</span>
            <kbd class="ax-text-label-md ax-bg-surface-container ax-border ax-rounded-sm ax-color-primary" style="font-size: 10px; padding: 0 0.375rem">Esc</kbd><span class="ax-text-body-sm ax-color-outline" style="font-size: 10px">关闭</span>
          </div>
        </div>
        <div class="ax-bg-surface-container-lowest ax-flex ax-items-start" style="width: 336px; padding: 1rem; overflow-y: auto">
          <div class="ax-space-y-sm" style="width: 100%">
            <p class="ax-text-body-sm ax-color-secondary" style="font-size: 11px; line-height: 1.6">
              ImageViewer 基于 <code class="ax-bg-surface-container ax-rounded-sm ax-color-primary" style="padding: 0 0.25rem">Teleport to body</code> 全屏覆盖渲染。
            </p>
            <div class="ax-flex ax-gap-xs">
              <span v-for="(img, i) in demoImages" :key="i" class="ax-bg-surface-container ax-border ax-rounded-sm" style="width: 2.5rem; height: 2rem; overflow: hidden">
                <img :src="img" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.6" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AxImageViewer instance -->
    <AxImageViewer :images="demoImages" :initial-index="0" v-model:visible="showImageViewer" />
  </div>

  <!-- FloatingBall (rendered to document body) -->
  <FloatingBall v-if="showBall" :prefs="ballPrefs" @save-prefs="handleBallSave" @main-click="() => { }" @open-settings="() => { }" />
</template>

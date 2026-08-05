<script setup lang="ts">
import { ref, computed, reactive, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import { Toaster } from 'vue-sonner'
import { useNotify } from '../hooks/useNotify'
import ComponentsView from './ComponentsView.vue'
import SettingsDialog from './SettingsDialog.vue'
import DemoView from './DemoView.vue'
import type { AppSettings } from './SettingsView.vue'
import AxInput from '../AxInput.vue'
import AxIcon from '../AxIcon.vue'

interface SubMenuItem {
  id: string
  name: string
  sectionId: string
}

interface NavItem {
  id: string
  name: string
  icon: string
  badge: string | null
  expanded: boolean
  subMenus: SubMenuItem[]
}

const activeTab = ref<string>('components')
const navItems = ref<NavItem[]>([
  {
    id: 'components',
    name: 'UI 组件列表',
    icon: 'settings',
    badge: '15 个组件',
    expanded: true,
    subMenus: [
      { id: 'btn', name: 'Button 按钮', sectionId: 'section-btn' },
      { id: 'input', name: 'Input 输入框', sectionId: 'section-input' },
      { id: 'slider', name: 'Slider 滑块', sectionId: 'section-slider' },
      { id: 'switch', name: 'Switch 开关', sectionId: 'section-switch' },
      { id: 'alert', name: 'Alert 提示', sectionId: 'section-alert' },
      { id: 'select', name: 'Select 选择器', sectionId: 'section-select' },
      { id: 'tooltip', name: 'Tooltip 气泡', sectionId: 'section-tooltip' },
      { id: 'dropdown', name: 'Dropdown 下拉', sectionId: 'section-dropdown' },
      { id: 'popover', name: 'Popover 弹出', sectionId: 'section-popover' },
      { id: 'dialog', name: 'Dialog 对话框', sectionId: 'section-dialog' },
      { id: 'notify', name: 'Notify 通知', sectionId: 'section-notify' },
      { id: 'floating-ball', name: 'FloatingBall 悬浮球', sectionId: 'section-floating-ball' },
      { id: 'image', name: 'Image 图片', sectionId: 'section-image' },
      { id: 'json-viewer', name: 'JsonViewer JSON树', sectionId: 'section-json-viewer' },
      { id: 'image-viewer', name: 'ImageViewer 图片查看器', sectionId: 'section-image-viewer' },
    ],
  },
  {
    id: 'demo',
    name: 'DEMO 展示',
    icon: 'settings',
    badge: null,
    expanded: false,
    subMenus: [
      { id: 'overview', name: 'Overview 控制台概览', sectionId: 'section-overview' },
      { id: 'metrics', name: 'Metrics 指标卡片', sectionId: 'section-metrics' },
      { id: 'nav-cards', name: 'Quick Nav 快捷导航', sectionId: 'section-nav-cards' },
      { id: 'settings-groups', name: 'Settings Groups 设置分组', sectionId: 'section-settings-groups' },
      { id: 'faq', name: 'FAQ 常见问题', sectionId: 'section-faq' },
      { id: 'activities', name: 'Activities 最近活动', sectionId: 'section-activities' },
    ],
  },
])

const activeTabTitle = computed(() => navItems.value.find((i) => i.id === activeTab.value)?.name ?? '工作台')

const setExpandedNav = (itemId: string, expanded: boolean) => {
  navItems.value.forEach((nav) => {
    nav.expanded = nav.id === itemId && expanded
  })
}

const handleParentClick = (item: NavItem) => {
  if (activeTab.value !== item.id) {
    activeTab.value = item.id
    setExpandedNav(item.id, true)
  } else {
    setExpandedNav(item.id, !item.expanded)
  }
}

const handleSubClick = (item: NavItem, sectionId: string) => {
  if (activeTab.value !== item.id) {
    activeTab.value = item.id
    setExpandedNav(item.id, true)
  }
  nextTick(() => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const { activeNotificationCount, notificationHistory, triggerNotify, clearLogs } = useNotify()

const liveTime = ref('')
let timer: ReturnType<typeof setInterval> | null = null
const updateTime = () => {
  const n = new Date()
  liveTime.value = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')} ${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}:${String(n.getSeconds()).padStart(2, '0')}`
}

const latencyHistory = ref([21, 24, 18, 15, 23, 26, 29, 32, 28, 22, 19, 17, 21, 25, 22])
const latestLatency = computed(() => latencyHistory.value[latencyHistory.value.length - 1] ?? 0)
let sparklineTimer: ReturnType<typeof setInterval> | null = null

const backupEnabled = ref(true)
const cpuLimit = ref(45)
const selectedClearance = ref('level-2')
const clearanceOptions = [
  { value: 'level-0', label: 'Public / 无级别公开限制' },
  { value: 'level-1', label: 'Restricted (Level 1) / 敏感等级' },
  { value: 'level-2', label: 'Confidential (Level 2) / 保密限制级' },
  { value: 'level-3', label: 'Secret (Level 3) / 核心机密层' },
  { value: 'level-4', label: 'Top Secret (Level 4) / 最高物理防御' },
]
const selectedClearanceKey = computed(
  () => clearanceOptions.find((i) => i.value === selectedClearance.value)?.label.split(' / ')[0] ?? 'CONFIDENTIAL',
)
const selectedClearanceLevel = computed(() => parseInt(selectedClearance.value.split('-')[1] ?? '0') || 0)

const updateLatency = () => {
  const base = 12 + Math.floor(cpuLimit.value * 0.15)
  const next = Math.max(5, base + Math.floor((Math.random() - 0.5) * 12))
  latencyHistory.value.push(next)
  if (latencyHistory.value.length > 25) latencyHistory.value.shift()
}

const sparklinePath = computed(() => {
  const data = latencyHistory.value
  const mx = Math.max(...data, 25)
  const mn = Math.min(...data, 5)
  const rng = mx - mn || 1
  return data
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${((i / (data.length - 1)) * 100).toFixed(1)} ${(28 - ((v - mn) / rng) * 24).toFixed(1)}`)
    .join(' ')
})
const sparklineAreaPath = computed(() => (sparklinePath.value ? `${sparklinePath.value} L 100 30 L 0 30 Z` : ''))

const settings = reactive<AppSettings>({
  language: 'zh', timezone: 'asia-shanghai', consoleName: 'Axiom Console', theme: 'light',
  autoSave: true, workerCount: '4', hwAccel: true, sessionTimeout: 30,
  twoFactor: false, ipWhitelist: false, ipList: '', dbAddress: 'mongodb+srv://axiom-cluster-prod.internal.net:27017/core-system',
  startupScript: '', debugMode: false,
  notifications: { cpuAlert: true, securityAlert: true, backupComplete: true, loginAlert: false, updateAvailable: true },
})

const resetSettings = () => {
  Object.assign(settings, {
    language: 'zh', timezone: 'asia-shanghai', consoleName: 'Axiom Console', theme: 'light',
    autoSave: true, workerCount: '4', hwAccel: true, sessionTimeout: 30,
    twoFactor: false, ipWhitelist: false, ipList: '', debugMode: false,
  })
  triggerNotify('所有设置已重置为出厂默认值。', 'info', '设置已重置')
}
const saveSettings = () => triggerNotify('系统配置已成功持久化保存至磁盘。', 'success', '设置已保存')

const showDialog = ref(false)
const showSimpleDialog = ref(false)
const dialogConfirmText = ref('')
const dialogSliderVal = ref(50)
const confirmInput = ref<InstanceType<typeof AxInput> | null>(null)

const openDialog = () => {
  showDialog.value = true
  dialogConfirmText.value = ''
  nextTick(() => confirmInput.value?.focus?.())
}
const onDialogClose = () => { dialogConfirmText.value = '' }
const executeSystemReset = () => {
  if (dialogConfirmText.value !== 'CONFIRM') return
  cpuLimit.value = dialogSliderVal.value
  backupEnabled.value = false
  selectedClearance.value = 'level-1'
  showDialog.value = false
  triggerNotify('系统重构回滚规程已成功灌入物理芯片。核心参数已被强制重置。', 'error', '核心重置成功')
}

const showProfileDropdown = ref(false)
const settingsDialogRef = ref<InstanceType<typeof SettingsDialog> | null>(null)
const settingsActiveTab = ref('general')
const settingsNavItems = [
  { id: 'general', label: '通用设置', icon: 'settings' },
  { id: 'performance', label: '性能与算力', icon: 'settings' },
  { id: 'security', label: '安全与权限', icon: 'search' },
  { id: 'notifications', label: '通知与告警', icon: 'settings' },
  { id: 'advanced', label: '高级配置', icon: 'settings' },
]
const settingsBottomNavItems = [
  { id: 'help', label: '帮助文档', icon: 'settings' },
  { id: 'status', label: '系统状态', icon: 'settings' },
]
const triggerDropdownAction = (action: string) => {
  if (action === 'export') triggerNotify('正在压缩状态并导出为 JSON。', 'info', '导出状态包')
  else if (action === 'logs') clearLogs()
  else if (action === 'reset') {
    backupEnabled.value = true
    cpuLimit.value = 45
    selectedClearance.value = 'level-2'
    triggerNotify('控制台联动数据已恢复出厂状态配置。', 'success', '系统复位')
  }
}

const showNotificationsPanel = ref(false)
const searchQuery = ref('')
const globalSearchInput = ref<InstanceType<typeof AxInput> | null>(null)
const focusSearch = () => globalSearchInput.value?.focus?.()

const keys = useMagicKeys()
watch([keys['Meta+K'], keys['Control+K'], keys['/']], (v) => {
  if (v.some(Boolean)) focusSearch()
})

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (showDialog.value) showDialog.value = false
    if (showSimpleDialog.value) showSimpleDialog.value = false
    if (showProfileDropdown.value) showProfileDropdown.value = false
    if (showNotificationsPanel.value) showNotificationsPanel.value = false
  }
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  sparklineTimer = setInterval(updateLatency, 1500)
  setTimeout(() => triggerNotify('Axiom UI 组件展示台已就绪，视图已拆分为独立组件。', 'success', '系统唤醒'), 400)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  if (sparklineTimer) clearInterval(sparklineTimer)
})
</script>

<template>
  <div class="ax-flex" style="height: 100vh; width: 100vw; overflow: hidden" @keydown="handleGlobalKeydown">
    <Toaster
      position="top-center"
      :toast-options="{ style: { background: 'transparent', border: 'none', boxShadow: 'none', padding: '0px' } }"
    />

    <aside class="ax-layout-sidebar">
      <div class="ax-space-y-lg">
        <div class="ax-flex ax-items-center ax-gap-sm" style="padding: 0 0.5rem">
          <div class="ax-bg-primary ax-rounded-lg ax-flex ax-items-center ax-justify-center" style="width: 1.75rem; height: 1.75rem; color: var(--ax-color-on-primary)">
            <AxIcon name="settings" :size="18" />
          </div>
          <div>
            <h2 class="ax-text-headline-sm ax-color-primary">Axiom Console</h2>
            <div class="ax-flex ax-items-center ax-gap-xs">
              <span class="ax-inline-block ax-rounded-full ax-bg-primary" style="width: 6px; height: 6px; animation: pulse 2s infinite"></span>
              <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">v1.0.5-BETA</span>
            </div>
          </div>
        </div>

        <div style="padding: 0 0.5rem">
          <div
            class="ax-flex ax-items-center ax-justify-between ax-bg-surface-container-low ax-border ax-rounded-lg" style="padding: 0.375rem 0.5rem; cursor: pointer"
            @click="focusSearch"
          >
            <div class="ax-flex ax-items-center ax-gap-xs ax-color-secondary">
              <AxIcon name="search" :size="16" />
              <span class="ax-text-body-sm">搜索组件...</span>
            </div>
            <kbd class="ax-text-label-md ax-bg-surface-container ax-border ax-rounded-sm ax-color-secondary" style="font-size: 10px; padding: 0 0.25rem">⌘K</kbd>
          </div>
        </div>

        <nav class="ax-space-y-xs">
          <p class="ax-text-label-md ax-color-secondary" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; padding: 0 0.5rem; padding-bottom: 0.25rem">主要视图</p>
          <div v-for="item in navItems" :key="item.id">
            <div
              :class="[
                activeTab === item.id ? 'ax-nav-item--active' : 'ax-nav-item--inactive',
              ]"
              class="ax-nav-item"
              @click="handleParentClick(item)"
            >
              <div class="ax-flex ax-items-center ax-gap-sm">
                <AxIcon :name="item.icon" :size="18" />
                <span>{{ item.name }}</span>
              </div>
              <div class="ax-flex ax-items-center ax-gap-xs">
                <span
                  v-if="item.badge"
                  class="ax-text-label-md ax-bg-surface-container ax-border ax-rounded-sm ax-color-primary" style="font-size: 10px; padding: 0.125rem 0.375rem; font-weight: 500"
                >{{ item.badge }}</span>
                <AxIcon
                  name="expand_more"
                  :size="14"
                  class="ax-color-secondary ax-flex-shrink-0"
                  :class="item.expanded ? 'ax-select__arrow--open' : ''"
                />
              </div>
            </div>

            <div
              class="ax-hidden"
              :class="item.expanded ? '' : ''"
              :style="item.expanded ? '' : 'display: none'"
            >
              <div v-show="item.expanded" style="margin-left: 1rem; margin-top: 0.25rem; border-left: 2px solid rgba(200, 197, 202, 0.6); padding-left: 0.5rem">
                <a
                  v-for="sub in item.subMenus"
                  :key="sub.id"
                  href="#"
                  class="ax-nav-subitem"
                  @click.prevent="handleSubClick(item, sub.sectionId)"
                >
                  <span class="ax-nav-subitem__dot"></span>
                  <span>{{ sub.name }}</span>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div class="ax-space-y-sm">
        <AxButton
          variant="ghost"
          block
          icon="settings"
          icon-size="16px"
          @click="settingsDialogRef?.open()"
        >设置界面</AxButton>

        <div class="ax-border-t ax-flex ax-items-center ax-justify-between" style="padding: 0 0.5rem; padding-top: 1rem">
          <div class="ax-flex ax-items-center ax-justify-between" style="width: 100%">
          <div class="ax-flex ax-items-center ax-gap-sm">
            <div class="ax-bg-surface-container ax-border ax-rounded-full ax-flex ax-items-center ax-justify-center ax-color-primary" style="width: 2rem; height: 2rem; font-size: 14px; font-weight: 600; font-family: var(--ax-font-label-md)">
              AM
            </div>
            <div style="overflow: hidden; width: 6rem">
              <h4 class="ax-text-body-sm ax-color-primary" style="font-size: 12px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">Alex Mercer</h4>
              <p class="ax-text-body-sm ax-color-secondary" style="font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">System Architect</p>
            </div>
          </div>
          <AxDropdown v-model="showProfileDropdown" placement="top-start">
            <template #trigger>
              <AxButton variant="ghost" size="icon" icon="more_vert" icon-size="16px" />
            </template>
            <template #default="{ close }">
              <div class="ax-dropdown__body" style="width: 11rem">
                <button class="ax-dropdown__item" @click="triggerDropdownAction('export'); close()">
                  <AxIcon name="download" :size="16" /><span>导出系统配置</span>
                </button>
                <button class="ax-dropdown__item" @click="triggerDropdownAction('logs'); close()">
                  <AxIcon name="refresh" :size="16" /><span>清空日志队列</span>
                </button>
                <div class="ax-dropdown__divider" />
                <button class="ax-dropdown__item ax-dropdown__item--danger" @click="triggerDropdownAction('reset'); close()">
                  <AxIcon name="refresh" :size="16" /><span>复位仪表盘</span>
                </button>
              </div>
            </template>
          </AxDropdown>
          </div>
        </div>
      </div>
    </aside>

    <div class="ax-flex-1 ax-flex ax-flex-col" style="overflow: hidden; background-color: var(--ax-color-background)">
      <header class="ax-layout-header">
        <div class="ax-flex ax-items-center ax-gap-sm">
          <span class="ax-text-body-sm ax-color-secondary">工作空间</span>
          <span class="ax-color-outline-variant">/</span>
          <span class="ax-text-body-sm ax-color-secondary">控制台</span>
          <span class="ax-color-outline-variant">/</span>
          <span class="ax-text-body-sm ax-color-primary" style="font-weight: 500">{{ activeTabTitle }}</span>
        </div>
        <div class="ax-flex ax-items-center ax-gap-md">
          <div class="ax-text-label-md ax-color-secondary ax-border ax-bg-surface-container-low ax-rounded-lg ax-flex ax-items-center ax-gap-xs" style="padding: 0.25rem 0.625rem">
            <AxIcon name="settings" :size="14" />
            <span>{{ liveTime }}</span>
          </div>
          <div style="position: relative">
            <AxInput ref="globalSearchInput" v-model="searchQuery" size="lg" placeholder="快速搜索..." class="w-44" @keydown.esc="searchQuery = ''">
              <template #prefix><AxIcon name="search" :size="14" /></template>
            </AxInput>
          </div>
          <AxTooltip content="系统通知日志" placement="bottom">
            <AxButton
              variant="ghost"
              size="icon-lg"
              icon="settings"
              class="ax-border"
              @click="showNotificationsPanel = !showNotificationsPanel"
            >
              <template #suffix>
                <span
                  v-if="activeNotificationCount > 0"
                  class="ax-bg-primary ax-rounded-full ax-flex ax-items-center ax-justify-center" style="position: absolute; top: -0.25rem; right: -0.25rem; width: 0.875rem; height: 0.875rem; font-size: 9px; color: var(--ax-color-on-primary); font-weight: 700"
                >{{ activeNotificationCount }}</span>
              </template>
            </AxButton>
          </AxTooltip>
        </div>
      </header>

      <main class="ax-layout-main ax-scrollbar-hide">
        <ComponentsView
          v-if="activeTab === 'components'"
          @open-dialog="openDialog"
          @open-simple-dialog="showSimpleDialog = true"
        />
        <DemoView
          v-else-if="activeTab === 'demo'"
          :cpu-limit="cpuLimit"
          :backup-enabled="backupEnabled"
          :selected-clearance-key="selectedClearanceKey"
          :selected-clearance-level="selectedClearanceLevel"
          :latest-latency="latestLatency"
          :latency-history="latencyHistory"
          :sparkline-path="sparklinePath"
          :sparkline-area-path="sparklineAreaPath"
        />
      </main>

      <Transition
        enter-active-class="ax-notification-panel-enter-active"
        enter-from-class="ax-notification-panel-enter-from"
        enter-to-class="ax-notification-panel-enter-active"
        leave-active-class="ax-notification-panel-leave-active"
        leave-from-class="ax-notification-panel-leave-active"
        leave-to-class="ax-notification-panel-leave-to"
      >
        <div
          v-show="showNotificationsPanel"
          class="ax-notification-panel"
        >
          <div>
            <div class="ax-flex ax-items-center ax-justify-between ax-border-b" style="padding-bottom: 0.5rem; margin-bottom: 1rem">
              <h3 class="ax-text-headline-sm ax-color-primary" style="font-size: 14px; font-weight: 600">系统通知历史队列</h3>
              <AxButton variant="ghost" size="icon" icon="close" icon-size="16px" @click="showNotificationsPanel = false" />
            </div>
            <div class="ax-space-y-sm ax-scrollbar-hide" style="overflow-y: auto; max-height: 70vh; padding-right: 0.25rem">
              <div v-for="log in notificationHistory" :key="log.id" class="ax-notification-log">
                <div class="ax-flex ax-items-center ax-justify-between">
                  <span class="ax-notification-log__time">{{ log.time }}</span>
                  <span
                    class="ax-notification-log__badge"
                    :class="{
                      'ax-notification-log__badge--info': log.type === 'info',
                      'ax-notification-log__badge--error': log.type === 'error',
                      'ax-notification-log__badge--secondary': log.type === 'secondary',
                      'ax-notification-log__badge--success': log.type === 'success',
                    }"
                  >{{ log.type }}</span>
                </div>
                <h5 class="ax-notification-log__title">{{ log.title }}</h5>
                <p class="ax-notification-log__message">{{ log.message }}</p>
              </div>
              <div v-if="notificationHistory.length === 0" class="ax-color-secondary ax-text-body-sm" style="text-align: center; padding: 3rem 0">当前尚无系统交互历史记录</div>
            </div>
          </div>
          <AxButton
            variant="outline"
            block
            icon="delete"
            :disabled="notificationHistory.length === 0"
            @click="clearLogs"
          >清空所有日志</AxButton>
        </div>
      </Transition>

      <footer class="ax-layout-footer">
        <div class="ax-flex ax-items-center ax-gap-md">
          <div class="ax-flex ax-items-center ax-gap-xs">
            <span class="ax-inline-block ax-rounded-full" style="width: 0.5rem; height: 0.5rem; background-color: #10b981; animation: pulse 2s infinite"></span>
            <span>核心系统: 正常运行 (Operational)</span>
          </div>
          <span class="ax-color-outline-variant">|</span>
          <span class="ax-text-label-md" style="font-size: 11px">API 往返延时: {{ latestLatency }}ms</span>
        </div>
        <div class="ax-flex ax-items-center ax-gap-sm">
          <span>Axiom Studio © 2026</span>
          <span class="ax-color-outline-variant">•</span>
          <a href="#" class="ax-color-primary ax-text-label-md ax-flex ax-items-center ax-gap-xs" style="font-size: 11px">
            <span>系统架构白皮书</span>
            <AxIcon name="arrow_back" :size="12" />
          </a>
        </div>
      </footer>
    </div>

    <AxDialog v-model="showDialog" title="高危底层重置规程 (Security Authorization)" icon="search" @close="onDialogClose">
      <AxAlert type="error" :dismissible="false" title="高风险行为警告">
        您正试图执行系统核心重构恢复方案。这会直接洗刷掉所有内存缓存历史日志，并重置控制台内的一切算力及安全防御设置。请保证已备份完毕。
      </AxAlert>
      <div class="ax-space-y-sm">
        <label class="ax-text-label-md ax-color-primary ax-block" style="font-weight: 600">第一步：在输入框内确认您的重置声明书</label>
        <p class="ax-text-body-sm ax-color-secondary" style="font-size: 11px">
          请精确键入 "<span class="ax-text-label-md ax-color-primary" style="font-weight: 700">CONFIRM</span>" 来开启下方的二次确认授权锁定。
        </p>
        <AxInput ref="confirmInput" v-model="dialogConfirmText" placeholder="CONFIRM" />
      </div>
      <div class="ax-space-y-xs">
        <label class="ax-text-label-md ax-color-primary ax-block" style="font-weight: 600">第二步：确定重置后分配给初始化进程的限制等级</label>
        <div class="ax-bg-surface-container-low ax-border ax-rounded-lg" style="padding: 0.5rem">
          <AxSlider v-model="dialogSliderVal" :min="5" :max="95" show-value :value-label="dialogSliderVal + '%'" />
        </div>
      </div>
      <template #footer="{ close }">
        <AxButton variant="outline" @click="close">取消物理回退</AxButton>
        <AxButton icon="search" :disabled="dialogConfirmText !== 'CONFIRM'" @click="executeSystemReset">执行系统回滚</AxButton>
      </template>
    </AxDialog>

    <AxDialog v-model="showSimpleDialog" title="系统提示" icon="info" max-width="max-w-sm">
      <p class="ax-text-body-sm ax-color-on-surface-variant" style="line-height: 1.6">这是一个简单的提示对话框，仅包含文字内容。点击关闭按钮或按 ESC 键即可关闭。</p>
      <template #footer="{ close }">
        <AxButton @click="close">知道了</AxButton>
      </template>
    </AxDialog>

    <!-- 方式二：对话框式设置面板 -->
    <SettingsDialog
      ref="settingsDialogRef"
      v-model:active-tab="settingsActiveTab"
      :nav-items="settingsNavItems"
      :bottom-nav-items="settingsBottomNavItems"
      title="系统设置中心"
      subtitle="管理系统运行参数"
      @save="saveSettings"
      @cancel="resetSettings"
      @nav-click="(item) => triggerNotify(`「${item.label}」页面正在开发中`, 'info', '功能提示')"
    />
  </div>
</template>

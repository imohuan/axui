<script setup lang="ts">
import type { SelectOption } from '../types'
import AxIcon from '../AxIcon.vue'

export interface AppSettings {
  language: string
  timezone: string
  consoleName: string
  theme: string
  autoSave: boolean
  workerCount: string
  hwAccel: boolean
  sessionTimeout: number
  twoFactor: boolean
  ipWhitelist: boolean
  ipList: string
  dbAddress: string
  startupScript: string
  debugMode: boolean
  notifications: {
    cpuAlert: boolean
    securityAlert: boolean
    backupComplete: boolean
    loginAlert: boolean
    updateAvailable: boolean
  }
}

defineProps<{
  settings: AppSettings
  cpuLimit: number
  selectedClearance: string
  clearanceOptions: SelectOption[]
}>()

const emit = defineEmits<{
  'update:cpuLimit': [value: number]
  'update:selectedClearance': [value: string]
  reset: []
  save: []
  notify: [message: string, type?: string, title?: string]
}>()

const notifSettings = [
  { key: 'cpuAlert' as const, label: '算力占用告警', desc: '当算力使用率超过 85% 时推送警报' },
  { key: 'securityAlert' as const, label: '安全事件告警', desc: '检测到异常访问或攻击行为时通知' },
  { key: 'backupComplete' as const, label: '备份完成通知', desc: '自动备份任务完成后推送确认消息' },
  { key: 'loginAlert' as const, label: '异地登录提醒', desc: '从未知 IP 或设备登录时发出警告' },
  { key: 'updateAvailable' as const, label: '系统更新提醒', desc: '有新版本可用时在控制台展示通知' },
]

const onCpuChange = (v: number) => emit('update:cpuLimit', v)

const onClearanceChange = (opt: SelectOption | undefined) => {
  if (!opt) return
  emit('update:selectedClearance', String(opt.value))
  emit('notify', `防御权限级别已变更为: ${opt.label.split(' / ')[0]}`, 'secondary', '权限状态变更')
}

type ToggleKey = 'autoSave' | 'hwAccel' | 'twoFactor' | 'ipWhitelist' | 'debugMode'

function toggle(settings: AppSettings, key: ToggleKey) {
  settings[key] = !settings[key]
}

function toggleNotify(settings: AppSettings, key: ToggleKey, msgOn: string, msgOff: string, type?: string) {
  toggle(settings, key)
  emit('notify', settings[key] ? msgOn : msgOff, type)
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 42rem">
    <!-- 页头 -->
    <div style="border-bottom: 1px solid var(--ax-color-outline-variant); padding-bottom: 1rem">
      <h2 class="ax-text-headline-sm" style="color: var(--ax-color-primary); font-size: 20px; line-height: 28px">系统设置</h2>
      <p class="ax-text-body-sm" style="color: var(--ax-color-on-surface-variant); margin-top: 0.25rem">在此配置控制台的全局运行参数、安全策略及个性化选项。</p>
    </div>

    <!-- ═══════ 通用设置 ═══════ -->
    <section id="section-general" class="ax-card" style="scroll-margin-top: 1rem">
      <div class="ax-card-header">
        <AxIcon name="settings" :size="16" style="color: var(--ax-color-secondary)" />
        <span class="ax-card-header-title">通用设置</span>
      </div>
      <div class="ax-card-body">
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
          <div style="flex: 1">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">系统语言</p>
            <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">控制台界面显示语言</p>
          </div>
          <div style="flex-shrink: 0; width: 10rem; margin-left: auto">
            <AxSelect
              v-model="settings.language"
              :options="[
                { value: 'zh', label: '简体中文' },
                { value: 'en', label: 'English' },
                { value: 'ja', label: '日本語' },
                { value: 'ko', label: '한국어' },
              ]"
            />
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
          <div style="flex: 1">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">时区设置</p>
            <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">日志时间戳所使用的时区</p>
          </div>
          <div style="flex-shrink: 0; width: 12rem; margin-left: auto">
            <AxSelect
              v-model="settings.timezone"
              :options="[
                { value: 'asia-shanghai', label: 'Asia/Shanghai (UTC+8)' },
                { value: 'utc', label: 'UTC (UTC+0)' },
                { value: 'us-eastern', label: 'US/Eastern (UTC-5)' },
                { value: 'us-pacific', label: 'US/Pacific (UTC-8)' },
              ]"
            />
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
          <div style="flex: 1">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">控制台名称</p>
            <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">显示在顶栏和浏览器标签页中的名称</p>
          </div>
          <AxInput v-model="settings.consoleName" size="sm" placeholder="Axiom Console" style="flex-shrink: 0; width: 11rem; margin-left: auto" />
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
          <div style="flex: 1">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">外观主题</p>
            <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">控制台整体配色方案</p>
          </div>
          <div class="ax-segmented" style="margin-left: auto">
            <button
              v-for="t in [
                { v: 'light', i: 'light_mode' },
                { v: 'dark', i: 'dark_mode' },
                { v: 'auto', i: 'computer' },
              ]"
              :key="t.v"
              :class="settings.theme === t.v ? 'ax-button-primary' : 'ax-button-ghost'"
              class="ax-button" style="display: flex; align-items: center; gap: 0.5rem"
              @click="settings.theme = t.v"
            >
              <AxIcon :name="t.i" :size="14" />
              <span>{{ { light: '浅色', dark: '深色', auto: '跟随系统' }[t.v as 'light' | 'dark' | 'auto'] }}</span>
            </button>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0">
          <div style="flex: 1">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">自动保存配置</p>
            <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">变更后自动持久化系统设置</p>
          </div>
          <AxSwitch :model-value="settings.autoSave" size="sm" @update:model-value="toggle(settings, 'autoSave')" />
        </div>
      </div>
    </section>

    <!-- ═══════ 性能与算力 ═══════ -->
    <section id="section-performance" class="ax-card" style="scroll-margin-top: 1rem">
      <div class="ax-card-header">
        <AxIcon name="settings" :size="16" style="color: var(--ax-color-secondary)" />
        <span class="ax-card-header-title">性能与算力</span>
      </div>
      <div class="ax-card-body" style="display: flex; flex-direction: column; gap: 1rem">
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">算力限制上限</p>
            <span class="ax-text-label-md" style="color: var(--ax-color-primary); font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums">{{ cpuLimit }}%</span>
          </div>
          <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px">设置系统允许占用的最大计算资源百分比</p>
          <AxSlider
            :model-value="cpuLimit"
            :min="10" :max="100"
            show-labels show-value
            label-left="低功耗 (10%)"
            label-right="全功耗 (100%)"
            :value-label="cpuLimit + '%'"
            @update:model-value="onCpuChange"
          />
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; border-top: 1px solid rgba(200, 197, 202, 0.4); padding-top: 0.75rem">
          <div style="flex: 1">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">后台任务并发数</p>
            <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">同时运行的最大后台工作线程数量</p>
          </div>
          <div style="flex-shrink: 0; width: 8rem; margin-left: auto">
            <AxSelect
              v-model="settings.workerCount"
              :options="[
                { value: '1', label: '1 线程' },
                { value: '2', label: '2 线程' },
                { value: '4', label: '4 线程' },
                { value: '8', label: '8 线程' },
                { value: '16', label: '16 线程' },
              ]"
            />
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; border-top: 1px solid rgba(200, 197, 202, 0.4); padding-top: 0.75rem">
          <div style="flex: 1">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">硬件加速</p>
            <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">启用 GPU 加速渲染提升界面流畅度</p>
          </div>
          <AxSwitch :model-value="settings.hwAccel" size="sm" @update:model-value="toggleNotify(settings, 'hwAccel', '硬件加速已启用', '硬件加速已关闭', 'info')" />
        </div>
      </div>
    </section>

    <!-- ═══════ 安全与权限 ═══════ -->
    <section id="section-security" class="ax-card" style="scroll-margin-top: 1rem">
      <div class="ax-card-header">
        <AxIcon name="search" :size="16" style="color: var(--ax-color-secondary)" />
        <span class="ax-card-header-title">安全与权限</span>
      </div>
      <div class="ax-card-body">
        <div style="display: flex; align-items: center; gap: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
          <div style="flex: 1">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">防御等级</p>
            <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">系统安全扫描与防御响应强度</p>
          </div>
          <div style="flex-shrink: 0; width: 13rem; margin-left: auto">
            <AxSelect
              :model-value="selectedClearance"
              :options="clearanceOptions"
              searchable
              search-placeholder="检索防御权限..."
              @update:model-value="(v: string | number) => onClearanceChange(clearanceOptions.find((o) => o.value === v))"
            />
          </div>
        </div>
        <div style="padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">会话超时时间</p>
            <span class="ax-text-label-md" style="color: var(--ax-color-primary); font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums">{{ settings.sessionTimeout }} 分钟</span>
          </div>
          <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem; margin-bottom: 0.5rem">无操作自动注销的等待时间（分钟）</p>
          <AxSlider
            v-model="settings.sessionTimeout"
            :min="5" :max="120" :step="5"
            show-labels show-value
            label-left="5 分钟"
            label-right="120 分钟"
            :value-label="settings.sessionTimeout + ' 分钟'"
          />
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
          <div style="flex: 1">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">双因素认证</p>
            <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">登录时强制要求二次身份验证</p>
          </div>
          <AxSwitch :model-value="settings.twoFactor" size="sm" @update:model-value="toggleNotify(settings, 'twoFactor', '双因素认证已启用', '双因素认证已关闭，请注意安全风险', settings.twoFactor ? 'success' : 'error')" />
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
          <div style="flex: 1">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">IP 白名单过滤</p>
            <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">仅允许来自指定 IP 范围的访问请求</p>
          </div>
          <AxSwitch :model-value="settings.ipWhitelist" size="sm" @update:model-value="toggle(settings, 'ipWhitelist')" />
        </div>
        <div v-show="settings.ipWhitelist" style="padding-top: 0.75rem">
          <label class="ax-text-label-md" style="color: var(--ax-color-primary); font-size: 11px; font-weight: 600; margin-bottom: 0.25rem; display: block">IP 白名单列表</label>
          <textarea
            v-model="settings.ipList"
            rows="3"
            class="ax-input ax-input-textarea"
            style="width: 100%; padding: 0.625rem; font-size: 11px; resize: none"
            placeholder="每行输入一个 IP 或 CIDR 段&#10;例如: 192.168.1.0/24&#10;     10.0.0.1"
          />
        </div>
      </div>
    </section>

    <!-- ═══════ 通知与告警 ═══════ -->
    <section id="section-notifications" class="ax-card" style="scroll-margin-top: 1rem">
      <div class="ax-card-header">
        <AxIcon name="settings" :size="16" style="color: var(--ax-color-secondary)" />
        <span class="ax-card-header-title">通知与告警</span>
      </div>
      <div class="ax-card-body">
        <div v-for="notif in notifSettings" :key="notif.key" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
          <div style="flex: 1">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">{{ notif.label }}</p>
            <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">{{ notif.desc }}</p>
          </div>
          <AxSwitch :model-value="settings.notifications[notif.key]" size="sm" @update:model-value="settings.notifications[notif.key] = $event" />
        </div>
      </div>
    </section>

    <!-- ═══════ 高级配置 ═══════ -->
    <section id="section-advanced" class="ax-card" style="scroll-margin-top: 1rem">
      <div class="ax-card-header">
        <AxIcon name="settings" :size="16" style="color: var(--ax-color-secondary)" />
        <span class="ax-card-header-title">高级配置</span>
      </div>
      <div class="ax-card-body" style="display: flex; flex-direction: column; gap: 1rem">
        <div style="padding-bottom: 0.75rem; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
          <label class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600; display: block">数据库连接字符串</label>
          <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem; margin-bottom: 0.5rem">主节点物理地址，支持 MongoDB、PostgreSQL、Redis 格式</p>
          <AxInput v-model="settings.dbAddress" size="lg">
            <template #prefix><AxIcon name="settings" :size="16" /></template>
          </AxInput>
        </div>
        <div style="padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
          <label class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600; display: block">系统启动脚本</label>
          <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem; margin-bottom: 0.5rem">在服务初始化完成后执行的自定义 Shell 脚本片段</p>
          <textarea
            v-model="settings.startupScript"
            rows="5"
            class="ax-input ax-input-textarea"
            style="width: 100%; padding: 0.75rem; font-size: 11px; resize: none"
            placeholder="#!/bin/bash&#10;# 在此输入启动脚本...&#10;echo 'Axiom Console initializing...'"
          />
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding-top: 0.75rem; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
          <div style="flex: 1">
            <p class="ax-text-body-sm" style="color: var(--ax-color-primary); font-size: 13px; font-weight: 600">调试模式</p>
            <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">开启后将在控制台输出详细调试日志</p>
          </div>
          <AxSwitch :model-value="settings.debugMode" size="sm" @update:model-value="toggleNotify(settings, 'debugMode', '调试模式已开启，控制台将输出详细日志', '调试模式已关闭', 'secondary')" />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 0.75rem">
          <AxButton variant="outline" @click="emit('reset')">重置为默认值</AxButton>
          <AxButton icon="save" @click="emit('save')">保存所有设置</AxButton>
        </div>
      </div>
    </section>
  </div>
</template>

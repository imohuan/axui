<script setup lang="ts">
import { ref } from 'vue'
import AxIcon from '../AxIcon.vue'

defineProps<{
  cpuLimit: number
  backupEnabled: boolean
  selectedClearanceKey: string
  selectedClearanceLevel: number
  latestLatency: number
  latencyHistory: number[]
  sparklinePath: string
  sparklineAreaPath: string
}>()

const openFaq = ref<number | null>(null)
const toggleFaq = (id: number) => {
  openFaq.value = openFaq.value === id ? null : id
}

const faqs = [
  {
    id: 1,
    q: '如何安全地导出系统配置？',
    a: '在设置界面中选择「通用设置」→「自动保存配置」开启后，所有变更会自动持久化。你也可以通过侧边栏用户菜单手动导出当前状态为 JSON 文件。',
  },
  {
    id: 2,
    q: '算力限制达到 100% 会发生什么？',
    a: '系统将自动暂停所有后台低优先级任务，保留核心服务线程运行。前端界面仍可正常操作，但实时数据刷新频率会降低。',
  },
  {
    id: 3,
    q: '双因素认证支持哪些方式？',
    a: '目前支持 TOTP 时间型一次性密码（通过 Google Authenticator、Microsoft Authenticator 等应用生成）以及硬件安全密钥（FIDO2 / WebAuthn）。',
  },
  {
    id: 4,
    q: 'IP 白名单最多支持多少条规则？',
    a: '当前版本支持最多 256 条 IPv4 / IPv6 单地址或 CIDR 段规则。超出限制时最早的规则会被自动移除。',
  },
]

const activities = ref([
  { id: 1, time: '12:05', title: '自动备份完成', desc: '第 1,247 次增量备份成功写入持久化存储', type: 'success' },
  { id: 2, time: '11:42', title: '防御等级变更', desc: '管理员将系统防御等级从 Level 1 提升至 Level 2', type: 'info' },
  { id: 3, time: '10:18', title: '算力告警触发', desc: '实时算力占用达到 87%，超出预设阈值', type: 'warning' },
  { id: 4, time: '09:03', title: '核心服务重启', desc: '内核版本 v2.4.1 热更新完成，零停机切换', type: 'success' },
  { id: 5, time: '08:30', title: '异地登录检测', desc: '检测到来自 203.0.113.45 的新设备登录请求', type: 'error' },
])

const navCards = [
  { icon: 'settings', label: '实时监控', desc: '查看系统各项核心指标', color: 'ax-bg-primary ax-color-on-primary' },
  { icon: 'search', label: '安全中心', desc: '管理权限与防御策略', color: 'ax-bg-secondary-container ax-color-on-surface' },
  { icon: 'settings', label: '性能分析', desc: '算力与资源使用详情', color: 'ax-bg-surface-container-high ax-color-primary' },
  { icon: 'settings', label: '告警日志', desc: '历史通知与事件追踪', color: 'ax-bg-surface-container-high ax-color-primary' },
  { icon: 'settings', label: '备份管理', desc: '增量备份与恢复操作', color: 'ax-bg-surface-container-high ax-color-primary' },
  { icon: 'settings', label: '系统配置', desc: '全局参数与高级选项', color: 'ax-bg-surface-container-high ax-color-primary' },
]

const settingGroups = [
  {
    title: '账户管理',
    items: [
      { icon: 'settings', label: '个人资料', desc: '修改显示名称与身份标识' },
      { icon: 'settings', label: '计费与配额', desc: '查看资源使用账单与续费' },
      { icon: 'settings', label: '通知偏好', desc: '自定义各类消息的推送渠道' },
      { icon: 'settings', label: '安全设置', desc: '密码、双因素认证与登录历史' },
    ],
  },
  {
    title: '系统运维',
    items: [
      { icon: 'settings', label: '帮助中心', desc: '查阅官方文档与常见问题' },
      { icon: 'settings', label: '联系支持', desc: '提交工单或联系技术团队' },
      { icon: 'settings', label: '运行状态', desc: '查看各子系统的健康状态' },
    ],
  },
]
</script>

<template>
  <div class="ax-space-y-lg">
    <section id="section-overview" class="ax-card" style="padding: 1.5rem; position: relative; overflow: hidden">
      <div class="ax-flex ax-items-center ax-gap-xs" style="margin-bottom: 0.5rem">
        <span class="ax-inline-block ax-rounded-full" style="width: 0.5rem; height: 0.5rem; background-color: #10b981; animation: pulse 2s infinite"></span>
        <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em">系统运行中</span>
      </div>
      <h1 class="ax-text-headline-lg ax-color-primary" style="margin-bottom: 0.5rem">控制台概览</h1>
      <p class="ax-text-body-md ax-color-on-surface-variant" style="line-height: 1.6">
        实时监控核心集群运行状态，快速访问常用功能模块，浏览最近系统活动记录。
      </p>
      <div class="ax-hidden" style="position: absolute; right: 0; top: 0; bottom: 0; width: 33%; background: linear-gradient(to left, var(--ax-color-surface-container-low), transparent); opacity: 0.4; pointer-events: none"></div>
    </section>

    <div id="section-metrics" class="ax-flex ax-gap-gutter" style="flex-wrap: wrap">
      <div class="ax-card" style="flex: 1; min-width: 200px; padding: 1rem">
        <div class="ax-flex ax-justify-between ax-items-center ax-color-secondary" style="margin-bottom: 0.5rem">
          <span class="ax-text-label-md" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em">算力占用</span>
          <AxIcon name="settings" :size="16" />
        </div>
        <div class="ax-flex ax-items-baseline ax-gap-xs">
          <span class="ax-text-headline-lg ax-color-primary" style="font-size: 30px; font-weight: 700">{{ cpuLimit }}</span>
          <span class="ax-color-secondary ax-text-label-md" style="font-size: 12px">%</span>
        </div>
        <div class="ax-rounded-full" style="width: 100%; background-color: var(--ax-color-surface-container); height: 6px; margin-top: 0.75rem; overflow: hidden">
          <div class="ax-bg-primary" style="height: 100%; transition: width 0.3s" :style="{ width: cpuLimit + '%' }"></div>
        </div>
      </div>

      <div class="ax-card" style="flex: 1; min-width: 200px; padding: 1rem">
        <div class="ax-flex ax-justify-between ax-items-center ax-color-secondary" style="margin-bottom: 0.5rem">
          <span class="ax-text-label-md" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em">备份服务</span>
          <span class="ax-rounded-full" :class="backupEnabled ? 'ax-bg-primary' : 'ax-bg-surface-container'" style="width: 0.5rem; height: 0.5rem; animation: pulse 2s infinite"></span>
        </div>
        <div class="ax-flex ax-items-baseline ax-gap-xs">
          <span class="ax-text-headline-lg ax-color-primary" style="font-size: 30px; font-weight: 700">{{ backupEnabled ? '已开启' : '已离线' }}</span>
        </div>
        <p class="ax-text-body-sm ax-color-on-surface-variant" style="font-size: 11px; margin-top: 0.5rem">每隔一小时归档持久化配置</p>
      </div>

      <div class="ax-card" style="flex: 1; min-width: 200px; padding: 1rem">
        <div class="ax-flex ax-justify-between ax-items-center ax-color-secondary" style="margin-bottom: 0.5rem">
          <span class="ax-text-label-md" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em">防御等级</span>
          <AxIcon name="search" :size="16" />
        </div>
        <div class="ax-flex ax-items-baseline">
          <span class="ax-text-label-md ax-color-primary" style="font-size: 20px; font-weight: 700; line-height: 1.25; padding-top: 0.25rem">{{ selectedClearanceKey }}</span>
        </div>
        <div class="ax-flex ax-items-center ax-gap-xs" style="margin-top: 1rem">
          <span v-for="i in 4" :key="i" class="ax-rounded-full" style="height: 4px; width: 24px" :class="i <= selectedClearanceLevel ? 'ax-bg-primary' : 'ax-bg-surface-container'"></span>
        </div>
      </div>

      <div class="ax-card ax-flex ax-flex-col ax-justify-between" style="flex: 1; min-width: 200px; padding: 1rem">
        <div>
          <div class="ax-flex ax-justify-between ax-items-center ax-color-secondary" style="margin-bottom: 0.25rem">
            <span class="ax-text-label-md" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em">接口实时延迟</span>
            <span class="ax-text-label-md ax-color-primary" style="font-size: 10px; font-weight: 600; border: 1px solid var(--ax-color-outline-variant); padding: 0 6px; border-radius: var(--ax-radius-sm); background-color: var(--ax-color-surface-container)">LIVE</span>
          </div>
          <div class="ax-flex ax-items-baseline ax-gap-xs">
            <span class="ax-text-headline-lg ax-color-primary" style="font-size: 30px; font-weight: 700">{{ latestLatency }}</span>
            <span class="ax-color-secondary ax-text-label-md" style="font-size: 12px">ms</span>
          </div>
        </div>
        <div style="height: 2rem; margin-top: 0.5rem; width: 100%">
          <svg style="height: 100%; width: 100%" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path :d="sparklinePath" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" />
            <path :d="sparklineAreaPath" fill="rgba(0,0,0,0.05)" stroke="none" />
          </svg>
        </div>
      </div>
    </div>

    <div id="section-nav-cards" class="ax-flex ax-gap-gutter" style="flex-wrap: wrap">
      <div
        v-for="card in navCards"
        :key="card.label"
        class="ax-card ax-flex ax-items-center ax-gap-md" style="flex: 1; min-width: 280px; padding: 1rem; cursor: pointer"
      >
        <div :class="card.color" class="ax-flex ax-items-center ax-justify-center ax-rounded-lg" style="width: 2.5rem; height: 2.5rem; flex-shrink: 0">
          <AxIcon :name="card.icon" :size="20" />
        </div>
        <div class="ax-flex-1" style="min-width: 0">
          <p class="ax-text-body-sm ax-color-primary" style="font-size: 13px; font-weight: 600">{{ card.label }}</p>
          <p class="ax-text-body-sm ax-color-secondary" style="font-size: 11px; margin-top: 0.125rem">{{ card.desc }}</p>
        </div>
        <AxIcon name="chevron_right" :size="16" class="ax-color-secondary" />
      </div>
    </div>

    <div class="ax-flex ax-gap-gutter" style="flex-wrap: wrap">
      <div style="flex: 3; min-width: 0">
        <div id="section-settings-groups" class="ax-space-y-gutter scroll-mt-4">
        <div v-for="group in settingGroups" :key="group.title" class="ax-card">
          <div class="ax-card__header">
            <span class="ax-card__header-title">{{ group.title }}</span>
          </div>
          <div class="ax-card__body">
            <div
              v-for="item in group.items"
              :key="item.label"
              class="ax-flex ax-items-center ax-gap-md" style="padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4); cursor: pointer"
            >
              <AxIcon :name="item.icon" :size="18" class="ax-color-secondary" />
              <div class="ax-flex-1" style="min-width: 0">
                <p class="ax-text-body-sm ax-color-primary" style="font-size: 13px; font-weight: 600">{{ item.label }}</p>
                <p class="ax-text-body-sm ax-color-secondary" style="font-size: 11px; margin-top: 0.125rem">{{ item.desc }}</p>
              </div>
              <AxIcon name="chevron_right" :size="16" class="ax-color-secondary" />
            </div>
          </div>
        </div>
        </div>

        <div id="section-faq" class="ax-card scroll-mt-4">
          <div class="ax-card__header">
            <AxIcon name="search" :size="16" class="ax-color-secondary" />
            <span class="ax-card__header-title">常见问题</span>
          </div>
          <div class="ax-card__body">
            <div v-for="faq in faqs" :key="faq.id" style="border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
              <button
                class="ax-flex ax-justify-between ax-items-center" style="width: 100%; padding: 0.75rem 0; text-align: left; background: none; border: none; cursor: pointer"
                @click="toggleFaq(faq.id)"
              >
                <span class="ax-text-body-sm ax-color-primary" style="font-size: 13px; font-weight: 600">{{ faq.q }}</span>
                <AxIcon
                  name="expand_more"
                  :size="16"
                  class="ax-color-secondary ax-flex-shrink-0"
                  :class="openFaq === faq.id ? 'ax-select__arrow--open' : ''"
                  style="margin-left: 0.5rem"
                />
              </button>
              <div v-show="openFaq === faq.id" style="padding-bottom: 0.75rem">
                <p class="ax-text-body-sm ax-color-on-surface-variant" style="font-size: 12px; line-height: 1.6">{{ faq.a }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="flex: 2; min-width: 0">
        <div id="section-activities" class="ax-card scroll-mt-4" style="position: sticky; top: 0">
          <div class="ax-card__header ax-justify-between">
            <div class="ax-flex ax-items-center ax-gap-sm">
              <AxIcon name="refresh" :size="16" class="ax-color-secondary" />
              <span class="ax-card__header-title">最近活动</span>
            </div>
            <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">过去 24 小时</span>
          </div>
          <div class="ax-card__body ax-space-y-md">
            <div v-for="act in activities" :key="act.id" class="ax-flex ax-gap-sm">
              <div class="ax-flex ax-flex-col ax-items-center ax-gap-xs">
                <div
                  class="ax-rounded-full ax-flex-shrink-0"
                  style="width: 0.5rem; height: 0.5rem; margin-top: 0.375rem"
                  :class="{
                    'ax-bg-surface-container': act.type === 'success',
                    'ax-bg-primary': act.type === 'info',
                    'ax-bg-surface-container': act.type === 'warning',
                    'ax-bg-error-container': act.type === 'error',
                  }"
                ></div>
                <div v-if="act.id !== activities[activities.length - 1]?.id" class="ax-bg-surface-container" style="width: 1px; flex: 1"></div>
              </div>
              <div style="padding-bottom: 0.75rem">
                <div class="ax-flex ax-items-center ax-gap-xs" style="margin-bottom: 0.125rem">
                  <span class="ax-text-label-md ax-color-secondary" style="font-size: 10px">{{ act.time }}</span>
                  <span
                    class="ax-text-label-md ax-rounded-sm" style="font-size: 9px; padding: 0 0.25rem; text-transform: uppercase; font-weight: 600"
                    :class="{
                      'ax-bg-surface-container ax-color-primary ax-border': act.type === 'success',
                      'ax-bg-surface-container ax-color-primary ax-border': act.type === 'info',
                      'ax-bg-surface-container ax-color-primary ax-border': act.type === 'warning',
                      'ax-bg-error-container ax-color-error ax-border': act.type === 'error',
                    }"
                  >{{ act.type }}</span>
                </div>
                <p class="ax-text-body-sm ax-color-primary" style="font-size: 12px; font-weight: 600">{{ act.title }}</p>
                <p class="ax-text-body-sm ax-color-secondary" style="font-size: 11px; margin-top: 0.125rem; line-height: 1.6">{{ act.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

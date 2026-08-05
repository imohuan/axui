<script setup lang="ts">
import { reactive } from 'vue'
import AxIcon from '../AxIcon.vue'

// ── 侧边栏导航项 ──
interface NavSection {
  id: string
  label: string
  icon: string
}

const props = defineProps<{
  navItems: NavSection[]
  bottomNavItems?: NavSection[]
  title?: string
  subtitle?: string
}>()

const emit = defineEmits<{
  close: []
  cancel: []
  save: []
  navClick: [item: NavSection]
}>()

const activeTab = defineModel<string>('activeTab', { default: 'general' })
const isOpen = defineModel<boolean>({ default: false })

function open() { isOpen.value = true }
function close() { isOpen.value = false; emit('close') }
function handleCancel() { emit('cancel'); close() }
function handleSave() { emit('save'); close() }

defineExpose({ open, close })

// ── 配置数据 ──
const config = reactive({
  siteName: 'Axiom Console',
  maxUploadSize: 100,
  sessionTimeout: 30,
  retentionDays: 90,
  logLevel: 'info',
  enableCache: true,
  enableCompression: false,
  enableAutoBackup: true,
  backupTime: '03:00',
  backupPath: '/data/backups',
  threadCount: 4,
  cpuLimit: 70,
  hwAccel: true,
  gpuVendor: 'nvidia',
  authMethod: 'password',
  twoFactor: false,
  rateLimit: false,
  rateLimitCount: 100,
  auditLog: true,
  debugMode: false,
  profiler: false,
  logRetention: 30,
  maintenanceWindow: '02:00-04:00',
})
</script>

<template>
  <AxDialog v-model="isOpen" :title="title ?? '系统设置中心'" icon="settings" max-width="820px" body-class="" @close="close">
    <div style="display: flex; height: 520px; overflow: hidden">
      <!-- ══════ 左侧导航栏 ══════ -->
      <aside
        class="ax-layout-sidebar" style="width: 192px; padding: 0.5rem">
        <div style="margin-bottom: 1rem; padding: 0 0.5rem">
          <h2 class="ax-text-headline-sm" style="color: var(--ax-color-primary); font-weight: 700">
            {{ title ?? 'Configuration' }}
          </h2>
          <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 10px; margin-top: 0.125rem">
            {{ subtitle ?? '管理系统运行参数' }}
          </p>
        </div>

        <nav style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem">
          <button v-for="item in navItems" :key="item.id" :class="[
            activeTab === item.id
              ? 'ax-nav-item--active'
              : 'ax-nav-item--inactive',
          ]"
            class="ax-nav-item"
            @click="activeTab = item.id">
            <div style="display: flex; align-items: center; gap: 0.75rem">
              <AxIcon :name="item.icon" :size="16" />
              <span>{{ item.label }}</span>
            </div>
          </button>
        </nav>

        <div v-if="bottomNavItems?.length" style="border-top: 1px solid var(--ax-color-outline-variant); padding-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem">
          <button v-for="item in bottomNavItems" :key="item.id"
            class="ax-nav-subitem"
            @click="emit('navClick', item)">
            <AxIcon :name="item.icon" :size="16" />
            <span>{{ item.label }}</span>
          </button>
        </div>
      </aside>

      <!-- ══════ 右侧主内容区 ══════ -->
      <div style="flex: 1; display: flex; flex-direction: column; min-width: 0">
        <div class="ax-layout-main ax-scrollbar-hide" style="flex: 1">

          <!-- ──── 通用设置 ──── -->
          <template v-if="activeTab === 'general'">
            <div style="border-bottom: 1px solid var(--ax-color-outline-variant); padding-bottom: 0.5rem; margin-bottom: 0.5rem">
              <h3 class="ax-text-headline-sm" style="color: var(--ax-color-primary)">通用设置</h3>
              <p class="ax-text-body-sm" style="color: var(--ax-color-on-surface-variant); margin-top: 0.25rem">配置控制台基本运行参数与展示选项。</p>
            </div>
            <section
              style="background: var(--ax-color-surface-container-lowest); border: 1px solid var(--ax-color-outline-variant); border-radius: var(--ax-radius-lg); padding: 1rem">
              <!-- 站点名称 (Input) -->
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">站点名称</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">显示在顶栏和浏览器标签页中的控制台名称</p>
                </div>
                <AxInput v-model="config.siteName" size="sm" style="flex-shrink: 0; width: 11rem" />
              </div>
              <!-- 上传限制 (Slider) -->
              <div style="padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">文件上传大小限制</p>
                  <span class="ax-text-label-md" style="color: var(--ax-color-primary); font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums">{{ config.maxUploadSize }}
                    MB</span>
                </div>
                <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem; margin-bottom: 0.5rem">单个文件上传的最大容量限制</p>
                <AxSlider v-model="config.maxUploadSize" :min="1" :max="500" :step="1" show-labels show-value
                  label-left="1 MB" label-right="500 MB" :value-label="config.maxUploadSize + ' MB'" />
              </div>
              <!-- 会话超时 (Slider) -->
              <div style="padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">会话超时时间</p>
                  <span class="ax-text-label-md" style="color: var(--ax-color-primary); font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums">{{ config.sessionTimeout
                  }} 分钟</span>
                </div>
                <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem; margin-bottom: 0.5rem">用户无操作后自动登出的等待时长</p>
                <AxSlider v-model="config.sessionTimeout" :min="5" :max="240" :step="5" show-labels show-value
                  label-left="5 分钟" label-right="240 分钟" :value-label="config.sessionTimeout + ' 分钟'" />
              </div>
              <!-- 保留天数 (Select) -->
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">日志保留天数</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">系统操作日志自动清理前的保留周期</p>
                </div>
                <div style="flex-shrink: 0; max-width: 160px; margin-left: auto">
                  <AxSelect v-model="config.retentionDays" size="sm" dropdownWidth="120px" placement="bottom-end"
                    :options="[
                      { value: 7, label: '7 天' },
                      { value: 30, label: '30 天' },
                      { value: 90, label: '90 天' },
                      { value: 180, label: '180 天' },
                      { value: 365, label: '365 天' },
                    ]" />
                </div>
              </div>
            </section>
          </template>

          <!-- ──── 性能与算力 ──── -->
          <template v-if="activeTab === 'performance'">
            <div style="border-bottom: 1px solid var(--ax-color-outline-variant); padding-bottom: 0.5rem; margin-bottom: 0.5rem">
              <h3 class="ax-text-headline-sm" style="color: var(--ax-color-primary)">性能与算力</h3>
              <p class="ax-text-body-sm" style="color: var(--ax-color-on-surface-variant); margin-top: 0.25rem">调整系统资源分配与计算性能参数。</p>
            </div>
            <section
              style="background: var(--ax-color-surface-container-lowest); border: 1px solid var(--ax-color-outline-variant); border-radius: var(--ax-radius-lg); padding: 1rem">
              <!-- 线程数 (Select) -->
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">工作线程数</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">并行处理任务的线程池大小，影响吞吐与延迟</p>
                </div>
                <div style="flex-shrink: 0; max-width: 160px; margin-left: auto">
                  <AxSelect v-model="config.threadCount" size="sm" dropdownWidth="120px" placement="bottom-end"
                    :options="[
                      { value: 1, label: '1 线程' },
                      { value: 2, label: '2 线程' },
                      { value: 4, label: '4 线程' },
                      { value: 8, label: '8 线程' },
                      { value: 16, label: '16 线程' },
                    ]" />
                </div>
              </div>
              <!-- CPU 限制 (Slider) -->
              <div style="padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">CPU 使用上限</p>
                  <span class="ax-text-label-md" style="color: var(--ax-color-primary); font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums">{{ config.cpuLimit
                  }}%</span>
                </div>
                <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem; margin-bottom: 0.5rem">限制系统最大 CPU 占用比例，防止过载</p>
                <AxSlider v-model="config.cpuLimit" :min="10" :max="100" :step="5" show-labels show-value
                  label-left="低负载" label-right="满负载" :value-label="config.cpuLimit + '%'" />
              </div>
              <!-- 硬件加速 (Switch) -->
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">硬件加速</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">启用 GPU 加速提升渲染与计算性能</p>
                </div>
                <AxSwitch :model-value="config.hwAccel" size="sm" @update:model-value="config.hwAccel = $event" />
              </div>
              <!-- GPU 厂商 (Select) -->
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">首选 GPU 厂商</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">硬件加速时优先使用的显卡品牌</p>
                </div>
                <div style="flex-shrink: 0; max-width: 160px; margin-left: auto">
                  <AxSelect v-model="config.gpuVendor" size="sm" dropdownWidth="120px" placement="bottom-end" :options="[
                    { value: 'nvidia', label: 'NVIDIA' },
                    { value: 'amd', label: 'AMD' },
                    { value: 'intel', label: 'Intel' },
                    { value: 'auto', label: '自动检测' },
                  ]" />
                </div>
              </div>
            </section>
          </template>

          <!-- ──── 安全与权限 ──── -->
          <template v-if="activeTab === 'security'">
            <div style="border-bottom: 1px solid var(--ax-color-outline-variant); padding-bottom: 0.5rem; margin-bottom: 0.5rem">
              <h3 class="ax-text-headline-sm" style="color: var(--ax-color-primary)">安全与权限</h3>
              <p class="ax-text-body-sm" style="color: var(--ax-color-on-surface-variant); margin-top: 0.25rem">配置身份验证、权限控制与审计策略。</p>
            </div>
            <section
              style="background: var(--ax-color-surface-container-lowest); border: 1px solid var(--ax-color-outline-variant); border-radius: var(--ax-radius-lg); padding: 1rem">
              <!-- 认证方式 (Select) -->
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">认证方式</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">用户登录时使用的身份验证协议</p>
                </div>
                <div style="flex-shrink: 0; max-width: 160px; margin-left: auto">
                  <AxSelect v-model="config.authMethod" size="sm" dropdownWidth="120px" placement="bottom-end" :options="[
                    { value: 'password', label: '密码登录' },
                    { value: 'sso', label: 'SSO 单点登录' },
                    { value: 'ldap', label: 'LDAP' },
                    { value: 'oauth', label: 'OAuth 2.0' },
                  ]" />
                </div>
              </div>
              <!-- 双因素认证 (Switch) -->
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">双因素认证</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">登录时强制要求手机验证码或硬件密钥</p>
                </div>
                <AxSwitch :model-value="config.twoFactor" size="sm" @update:model-value="config.twoFactor = $event" />
              </div>
              <!-- 审计日志 (Switch) -->
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">操作审计日志</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">记录所有用户操作，用于安全审查与合规</p>
                </div>
                <AxSwitch :model-value="config.auditLog" size="sm" @update:model-value="config.auditLog = $event" />
              </div>
              <!-- 速率限制 (Switch + Slider) -->
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">请求速率限制</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">限制 API 调用频率防止滥用与 DDoS 攻击</p>
                </div>
                <AxSwitch :model-value="config.rateLimit" size="sm" @update:model-value="config.rateLimit = $event" />
              </div>
              <!-- 开启速率限制后显示 Slider -->
              <div v-show="config.rateLimit"
                style="background: var(--ax-color-surface-container-lowest); padding: 0.75rem 0 0.75rem 1rem; border-left: 2px solid var(--ax-color-outline-variant); border-radius: 0 var(--ax-radius-md) var(--ax-radius-md) 0">
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">每分钟请求上限</p>
                  <span class="ax-text-label-md" style="color: var(--ax-color-primary); font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums">{{ config.rateLimitCount
                  }} 次</span>
                </div>
                <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem; margin-bottom: 0.5rem">超出限制的请求将被自动拒绝</p>
                <AxSlider v-model="config.rateLimitCount" :min="10" :max="1000" :step="10" show-labels show-value
                  label-left="10" label-right="1000" :value-label="config.rateLimitCount + ' 次/分'" />
              </div>
            </section>
          </template>

          <!-- ──── 通知与告警 ──── -->
          <template v-if="activeTab === 'notifications'">
            <div style="border-bottom: 1px solid var(--ax-color-outline-variant); padding-bottom: 0.5rem; margin-bottom: 0.5rem">
              <h3 class="ax-text-headline-sm" style="color: var(--ax-color-primary)">通知与告警</h3>
              <p class="ax-text-body-sm" style="color: var(--ax-color-on-surface-variant); margin-top: 0.25rem">管理事件通知类别与推送偏好。</p>
            </div>
            <section
              style="background: var(--ax-color-surface-container-lowest); border: 1px solid var(--ax-color-outline-variant); border-radius: var(--ax-radius-lg); padding: 1rem">
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">CPU 使用率告警</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">当 CPU 使用率超过阈值时推送通知</p>
                </div>
                <AxSwitch :model-value="true" size="sm" />
              </div>
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">磁盘空间告警</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">存储空间不足时向管理员发送紧急通知</p>
                </div>
                <AxSwitch :model-value="true" size="sm" />
              </div>
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">备份完成通知</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">自动备份任务完成后推送确认消息</p>
                </div>
                <AxSwitch :model-value="false" size="sm" />
              </div>
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">异地登录提醒</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">检测到异地或异常设备登录时发出警告</p>
                </div>
                <AxSwitch :model-value="true" size="sm" />
              </div>
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">系统更新提醒</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">有新版本或安全补丁时在控制台展示通知</p>
                </div>
                <AxSwitch :model-value="false" size="sm" />
              </div>
            </section>
          </template>

          <!-- ──── 高级配置 ──── -->
          <template v-if="activeTab === 'advanced'">
            <div style="border-bottom: 1px solid var(--ax-color-outline-variant); padding-bottom: 0.5rem; margin-bottom: 0.5rem">
              <h3 class="ax-text-headline-sm" style="color: var(--ax-color-primary)">高级配置</h3>
              <p class="ax-text-body-sm" style="color: var(--ax-color-on-surface-variant); margin-top: 0.25rem">开发者工具、备份与系统级调试选项。</p>
            </div>
            <section
              style="background: var(--ax-color-surface-container-lowest); border: 1px solid var(--ax-color-outline-variant); border-radius: var(--ax-radius-lg); padding: 1rem">
              <!-- 自动备份 (Switch) -->
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">自动备份</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">按定时计划自动备份数据库和配置文件</p>
                </div>
                <AxSwitch :model-value="config.enableAutoBackup" size="sm" @update:model-value="config.enableAutoBackup = $event" />
              </div>
              <!-- 备份路径 (Input) -->
              <div style="padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <label class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600; display: block">备份存储路径</label>
                <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem; margin-bottom: 0.5rem">自动备份文件的目标目录</p>
                <AxInput v-model="config.backupPath" size="md">
                  <template #prefix><AxIcon name="search" :size="16" /></template>
                </AxInput>
              </div>
              <!-- 备份时间 (Input) -->
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">每日备份时间</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">自动备份任务的执行时间点 (HH:MM)</p>
                </div>
                <AxInput v-model="config.backupTime" size="sm" style="flex-shrink: 0; width: 8rem" />
              </div>
              <!-- 日志级别 (Select) -->
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(200, 197, 202, 0.4)">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">日志输出级别</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">控制运行时日志的详细程度</p>
                </div>
                <div style="flex-shrink: 0; max-width: 160px; margin-left: auto">
                  <AxSelect v-model="config.logLevel" size="sm" dropdownWidth="120px" placement="bottom-end" :options="[
                    { value: 'error', label: '仅错误' },
                    { value: 'warn', label: '警告及以上' },
                    { value: 'info', label: '信息及以上' },
                    { value: 'debug', label: '调试模式' },
                  ]" />
                </div>
              </div>
              <!-- 调试模式 (Switch) -->
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0">
                <div style="flex: 1">
                  <p class="ax-text-label-md" style="color: var(--ax-color-primary); font-weight: 600">开发者调试模式</p>
                  <p class="ax-text-body-sm" style="color: var(--ax-color-secondary); font-size: 11px; margin-top: 0.125rem">输出详细堆栈信息和性能分析报告</p>
                </div>
                <AxSwitch :model-value="config.debugMode" size="sm" @update:model-value="config.debugMode = $event" />
              </div>
            </section>
          </template>

        </div>
      </div>
    </div>

    <template #footer>
      <AxButton variant="outline" @click="handleCancel">取消</AxButton>
      <AxButton icon="save" @click="handleSave">保存更改</AxButton>
    </template>
  </AxDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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
  'update:activeTab': [id: string]
  close: []
  cancel: []
  save: []
  navClick: [item: NavSection]
}>()

const activeTab = defineModel<string>('activeTab', { default: 'general' })

const isOpen = defineModel<boolean>({ default: false })

const activeTitle = computed(() => {
  const found = props.navItems.find((n) => n.id === activeTab.value)
  return found ? found.label : '设置'
})

function open() { isOpen.value = true }
function close() { isOpen.value = false; emit('close') }
function handleCancel() { emit('cancel'); close() }
function handleSave() { emit('save'); close() }

defineExpose({ open, close })
</script>

<template>
  <AxDialog
    v-model="isOpen"
    :title="title ?? '系统设置中心'"
    icon="settings"
    max-width="max-w-[820px]"
    @close="close"
  >
    <!-- ── Dialog 内部：左右分栏 ── -->
    <div class="flex h-[520px] -mx-margin -mt-2 overflow-hidden">
      <!-- ══════ 左侧导航栏 ══════ -->
      <aside
        class="w-48 shrink-0 border-r border-outline-variant bg-surface-container-lowest flex flex-col py-ax-md px-ax-sm select-none"
      >
        <div class="mb-ax-md px-2">
          <h2 class="font-headline-sm text-headline-sm text-primary font-bold">
            {{ title ?? 'Configuration' }}
          </h2>
          <p class="font-body-sm text-[10px] text-secondary mt-0.5">
            {{ subtitle ?? '管理系统运行参数' }}
          </p>
        </div>

        <nav class="flex-1 space-y-0.5">
          <button
            v-for="item in navItems"
            :key="item.id"
            :class="[
              activeTab === item.id
                ? 'bg-secondary-container text-on-secondary-container font-medium scale-[0.98]'
                : 'text-secondary hover:bg-surface-container-low',
            ]"
            class="flex items-center gap-ax-sm rounded-xl py-1.5 px-2 font-label-md text-label-md transition-all duration-100 cursor-pointer w-full text-left"
            @click="activeTab = item.id"
          >
            <span
              class="material-symbols-outlined text-[16px]"
              :style="{ fontVariationSettings: activeTab === item.id ? '\'FILL\' 1' : '\'FILL\' 0' }"
            >{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </button>
        </nav>

        <div
          v-if="bottomNavItems?.length"
          class="border-t border-outline-variant pt-ax-sm space-y-0.5"
        >
          <button
            v-for="item in bottomNavItems"
            :key="item.id"
            class="flex items-center gap-ax-sm rounded-xl py-1.5 px-2 font-label-md text-label-md text-secondary hover:bg-surface-container-low transition-colors cursor-pointer w-full text-left"
            @click="emit('navClick', item)"
          >
            <span class="material-symbols-outlined text-[16px]">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </button>
        </div>
      </aside>

      <!-- ══════ 右侧主内容区 ══════ -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- 顶部标题栏 -->
        <header class="flex items-center justify-between px-margin h-11 border-b border-outline-variant shrink-0">
          <span class="font-headline-sm text-headline-sm font-semibold text-primary">{{ activeTitle }}</span>
          <button
            class="text-secondary hover:bg-surface-container-low p-1 rounded transition-colors"
            @click="close"
          >
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </header>

        <!-- 可滚动内容区 → slot -->
        <div class="flex-1 overflow-y-auto p-margin scrollbar-hide">
          <slot />
        </div>

        <!-- 底部操作栏 -->
        <footer class="flex items-center justify-end gap-ax-sm px-margin py-ax-sm border-t border-outline-variant bg-surface-container-lowest shrink-0">
          <AxButton variant="outline" @click="handleCancel">取消</AxButton>
          <AxButton icon="save" @click="handleSave">保存更改</AxButton>
        </footer>
      </div>
    </div>
  </AxDialog>
</template>

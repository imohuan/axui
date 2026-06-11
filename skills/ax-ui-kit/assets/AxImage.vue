<script setup lang="ts">
/**
 * LazyImage — 懒加载图片组件
 *
 * 支持：loading / loaded / error 三态，点击放大预览，
 * hover 放大图标，自适应宽高比。
 */
import { ref, computed } from 'vue';

const props = withDefaults(defineProps<{
  /** 图片 URL */
  src: string;
  /** 替代文字 */
  alt?: string;
  /** 预览图片列表（用于 ImageViewer 多图浏览） */
  previewList?: string[] | null;
  /** 当前图片在 previewList 中的索引 */
  previewIndex?: number;
  /** 图片填充模式 */
  objectFit?: 'cover' | 'contain';
  /** 是否自适应宽高比（加载前保持正方形占位） */
  adaptiveAspect?: boolean;
}>(), {
  adaptiveAspect: false,
  objectFit: 'cover',
});

const emit = defineEmits<{
  load: [event: Event];
  error: [event: Event];
  /** 点击预览 */
  preview: [src: string, list: string[], index: number];
}>();

const loadState = ref<'loading' | 'loaded' | 'error'>('loading');
const retryKey = ref(0);

const imageSrc = computed(() => {
  if (retryKey.value <= 0) return props.src;
  const sep = props.src.includes('?') ? '&' : '?';
  return `${props.src}${sep}_retry=${retryKey.value}`;
});

function handleLoad(e: Event): void {
  loadState.value = 'loaded';
  emit('load', e);
}

function handleError(e: Event): void {
  loadState.value = 'error';
  emit('error', e);
}

function handleClick(): void {
  if (loadState.value === 'loaded') {
    const list = props.previewList ?? [imageSrc.value];
    const index = props.previewList ? (props.previewIndex ?? 0) : 0;
    emit('preview', imageSrc.value, list, index);
  } else if (loadState.value === 'error') {
    loadState.value = 'loading';
    retryKey.value++;
  }
}
</script>

<template>
  <div
    class="group relative w-full cursor-pointer overflow-hidden bg-surface-container-low"
    :class="[!adaptiveAspect ? 'h-full' : 'h-auto', adaptiveAspect && loadState !== 'loaded' ? 'aspect-square' : '']"
    @click="handleClick"
  >
    <!-- 加载中 -->
    <div v-if="loadState === 'loading'"
      class="absolute inset-0 flex flex-col items-center justify-center text-outline">
      <span class="material-symbols-outlined mb-ax-xs text-xl animate-spin">progress_activity</span>
      <span class="text-[10px]">加载中...</span>
    </div>

    <!-- 加载失败 -->
    <div v-else-if="loadState === 'error'"
      class="absolute inset-0 flex flex-col items-center justify-center text-error cursor-pointer">
      <span class="material-symbols-outlined mb-ax-xs text-xl">broken_image</span>
      <span class="text-[10px] font-medium">加载失败</span>
      <span class="mt-0.5 text-[9px] text-outline">点击重试</span>
    </div>

    <img
      :src="imageSrc"
      :alt="alt"
      class="w-full transition-all duration-300"
      :class="[
        !adaptiveAspect ? 'h-full' : 'h-auto',
        objectFit === 'cover' ? 'object-cover' : 'object-contain',
        loadState === 'loaded' ? 'opacity-100' : 'opacity-0',
      ]"
      loading="lazy"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Hover 放大提示 -->
    <div v-if="loadState === 'loaded'"
      class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
      <span class="material-symbols-outlined text-2xl text-white drop-shadow-md scale-75 transition-transform group-hover:scale-100">
        zoom_in
      </span>
    </div>
  </div>
</template>

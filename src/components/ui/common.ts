import type { ControlSize } from './types'

/**
 * 通用控件尺寸 CSS 变量映射表
 * 按钮、输入框、下拉框、Select 共用
 * 通过 :style 绑定到组件根元素，覆盖 CSS 变量值
 */
export const CONTROL_SIZE_STYLES: Record<ControlSize, Record<string, string>> = {
  xs: {
    '--ax-control-height': 'var(--ax-control-height-xs)',
    '--ax-control-padding-y': 'var(--ax-control-padding-y-xs)',
    '--ax-control-padding-x': 'var(--ax-control-padding-x-xs)',
    '--ax-control-radius': 'var(--ax-control-radius-xs)',
    '--ax-control-font-size': 'var(--ax-control-font-size-xs)',
    '--ax-control-line-height': 'var(--ax-control-line-height-xs)',
  },
  sm: {
    '--ax-control-height': 'var(--ax-control-height-sm)',
    '--ax-control-padding-y': 'var(--ax-control-padding-y-sm)',
    '--ax-control-padding-x': 'var(--ax-control-padding-x-sm)',
    '--ax-control-radius': 'var(--ax-control-radius-sm)',
    '--ax-control-font-size': 'var(--ax-control-font-size-sm)',
    '--ax-control-line-height': 'var(--ax-control-line-height-sm)',
  },
  md: {
    '--ax-control-height': 'var(--ax-control-height-md)',
    '--ax-control-padding-y': 'var(--ax-control-padding-y-md)',
    '--ax-control-padding-x': 'var(--ax-control-padding-x-md)',
    '--ax-control-radius': 'var(--ax-control-radius-md)',
    '--ax-control-font-size': 'var(--ax-control-font-size-md)',
    '--ax-control-line-height': 'var(--ax-control-line-height-md)',
  },
  lg: {
    '--ax-control-height': 'var(--ax-control-height-lg)',
    '--ax-control-padding-y': 'var(--ax-control-padding-y-lg)',
    '--ax-control-padding-x': 'var(--ax-control-padding-x-lg)',
    '--ax-control-radius': 'var(--ax-control-radius-lg)',
    '--ax-control-font-size': 'var(--ax-control-font-size-lg)',
    '--ax-control-line-height': 'var(--ax-control-line-height-lg)',
  },
  xl: {
    '--ax-control-height': 'var(--ax-control-height-xl)',
    '--ax-control-padding-y': 'var(--ax-control-padding-y-xl)',
    '--ax-control-padding-x': 'var(--ax-control-padding-x-xl)',
    '--ax-control-radius': 'var(--ax-control-radius-xl)',
    '--ax-control-font-size': 'var(--ax-control-font-size-xl)',
    '--ax-control-line-height': 'var(--ax-control-line-height-xl)',
  },
}

/**
 * Switch 控件尺寸 CSS 变量映射表
 * Switch 的 track/thumb 尺寸与普通控件差异较大，使用独立变量
 */
export const SWITCH_SIZE_STYLES: Record<ControlSize, Record<string, string>> = {
  xs: {
    '--ax-switch-track-width': 'var(--ax-switch-track-width-xs)',
    '--ax-switch-track-height': 'var(--ax-switch-track-height-xs)',
    '--ax-switch-thumb-size': 'var(--ax-switch-thumb-size-xs)',
    '--ax-switch-thumb-offset': 'var(--ax-switch-thumb-offset-xs)',
  },
  sm: {
    '--ax-switch-track-width': 'var(--ax-switch-track-width-sm)',
    '--ax-switch-track-height': 'var(--ax-switch-track-height-sm)',
    '--ax-switch-thumb-size': 'var(--ax-switch-thumb-size-sm)',
    '--ax-switch-thumb-offset': 'var(--ax-switch-thumb-offset-sm)',
  },
  md: {
    '--ax-switch-track-width': 'var(--ax-switch-track-width-md)',
    '--ax-switch-track-height': 'var(--ax-switch-track-height-md)',
    '--ax-switch-thumb-size': 'var(--ax-switch-thumb-size-md)',
    '--ax-switch-thumb-offset': 'var(--ax-switch-thumb-offset-md)',
  },
  lg: {
    '--ax-switch-track-width': 'var(--ax-switch-track-width-lg)',
    '--ax-switch-track-height': 'var(--ax-switch-track-height-lg)',
    '--ax-switch-thumb-size': 'var(--ax-switch-thumb-size-lg)',
    '--ax-switch-thumb-offset': 'var(--ax-switch-thumb-offset-lg)',
  },
  xl: {
    '--ax-switch-track-width': 'var(--ax-switch-track-width-xl)',
    '--ax-switch-track-height': 'var(--ax-switch-track-height-xl)',
    '--ax-switch-thumb-size': 'var(--ax-switch-thumb-size-xl)',
    '--ax-switch-thumb-offset': 'var(--ax-switch-thumb-offset-xl)',
  },
}

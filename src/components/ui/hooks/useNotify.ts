import { ref, h } from 'vue'
import { toast } from 'vue-sonner'
import AxIcon from '../AxIcon.vue'

type NotifyType = 'info' | 'success' | 'error' | 'secondary'

export interface NotificationLog {
  id: number
  time: string
  title: string
  message: string
  type: NotifyType
}

const getToastIcon = (type: NotifyType) => {
  if (type === 'success') return 'check_circle'
  if (type === 'error') return 'error'
  if (type === 'secondary') return 'settings'
  return 'info'
}

const getIconColor = (type: NotifyType) => {
  if (type === 'error') return 'ax-color-error'
  if (type === 'secondary') return 'ax-color-secondary'
  return 'ax-color-primary'
}

export function useNotify() {
  const activeNotificationCount = ref(0)
  const notificationHistory = ref<NotificationLog[]>([])

  const triggerNotify = (
    message: string,
    type: NotifyType = 'info',
    title = '通知气泡',
  ) => {
    const id = Date.now()

    toast.custom(
      (props: { onCloseToast: () => void }) =>
        h(
          'div',
          {
            class:
              'ax-flex ax-items-start ax-gap-sm ax-bg-surface-container-lowest ax-border ax-rounded-xl',
            style: 'padding: 1rem; box-shadow: var(--ax-shadow-pro); pointer-events: auto; width: 20rem; text-align: left',
          },
          [
            h(AxIcon, {
              name: getToastIcon(type),
              size: 20,
              class: getIconColor(type),
              style: 'margin-top: 0.125rem; flex-shrink: 0',
            }),
            h('div', { class: 'ax-flex-1' }, [
              h(
                'h4',
                {
                  class: 'ax-text-headline-sm ax-color-primary',
                  style: 'font-size: 14px; font-weight: 600; margin-bottom: 0.125rem',
                },
                title,
              ),
              h(
                'p',
                {
                  class: 'ax-text-body-sm ax-color-on-surface-variant',
                  style: 'line-height: 1.5',
                },
                message,
              ),
            ]),
            h(
              'button',
              {
                onClick: props.onCloseToast,
                class:
                  'ax-button ax-button--icon ax-button--ghost',
                style: 'flex-shrink: 0; margin-top: -0.125rem; margin-right: -0.25rem',
              },
              [h(AxIcon, { name: 'close', size: 16 })],
            ),
          ],
        ),
      {
        duration: 4000,
        onDismiss: () => {
          activeNotificationCount.value = Math.max(0, activeNotificationCount.value - 1)
        },
        onAutoClose: () => {
          activeNotificationCount.value = Math.max(0, activeNotificationCount.value - 1)
        },
      },
    )

    activeNotificationCount.value++

    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    notificationHistory.value.unshift({ id, time: timeStr, title, message, type })
  }

  const clearLogs = () => {
    notificationHistory.value = []
    triggerNotify('本地日志缓存序列已执行物理刷洗。', 'secondary', '日志洗刷完毕')
  }

  return {
    activeNotificationCount,
    notificationHistory,
    triggerNotify,
    clearLogs,
  }
}

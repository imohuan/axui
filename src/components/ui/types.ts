export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-lg'
export type InputSize = 'sm' | 'md' | 'lg'
export type ControlSize = 'sm' | 'md' | 'lg'
export type AlertType = 'info' | 'error' | 'success' | 'warning'

export interface SelectOption {
  value: string | number
  label: string
}

export type PropPanelFieldType =
  | 'switch'
  | 'input'
  | 'slider'
  | 'select'
  | 'textarea'
  | 'segmented'

export interface PropPanelSchemaItem {
  key: string
  label: string
  description?: string
  type: PropPanelFieldType
  options?: SelectOption[]
  min?: number
  max?: number
  step?: number
  placeholder?: string
  rows?: number
}

export type PropPanelModel = Record<string, unknown>

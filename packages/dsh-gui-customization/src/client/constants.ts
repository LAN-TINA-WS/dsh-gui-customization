/**
 * GUICustomization（组合版）— 常量：令牌映射、预设配色、氛围/背景默认值。
 */

// 覆盖层唯一 source（同 source 重调 = 整层替换并置顶）
export const SOURCE = 'dsh-gui-customization'

// 颜色字段 → 主题令牌
export const TOKEN_KEYS: Record<string, string> = {
  'bg-base': '--dsw-alias-bg-base',
  'label-primary': '--dsw-alias-label-primary',
  'layer-1': '--dsw-alias-bg-layer-1',
  'brand-primary': '--dsw-alias-brand-primary',
  'layer-2': '--dsw-alias-bg-layer-2',
  'border-l1': '--dsw-alias-border-l1',
  'sidebar': '--dsw-specific-sidebar-fill',
  'label-secondary': '--dsw-alias-label-secondary',
  'overlay': '--dsw-alias-bg-overlay',
  'border-l2': '--dsw-alias-border-l2',
  'error': '--dsw-alias-state-error-primary',
  'success': '--dsw-alias-state-success-primary',
  'warn': '--dsw-alias-state-warn-primary',
}

// 暗色模式基础值（brand 随预设亮化）
export const DARK: Record<string, string> = {
  'bg-base': '#0B0E17',
  'label-primary': '#ECEEF5',
  'layer-1': '#131829',
  'brand-primary': '#7AA2FF',
  'layer-2': '#1B2136',
  'border-l1': 'rgba(122,162,255,0.26)',
  'sidebar': '#0F1420',
  'label-secondary': '#9AA3BC',
  'overlay': '#1A2033',
  'border-l2': 'rgba(122,162,255,0.48)',
  'error': '#FF8080',
  'success': '#62D68F',
  'warn': '#FFC978',
}

export interface Palette {
  label: string
  brandDark: string
  light: Record<string, string>
}

// 预设配色（light 部分；dark 用 DARK + brandDark）
export const PALETTES: Record<string, Palette> = {
  nous: {
    label: 'Nous 蓝（默认）',
    brandDark: '#7AA2FF',
    light: {
      'bg-base': '#F8FAFF',
      'label-primary': '#17171A',
      'layer-1': '#FFFFFF',
      'brand-primary': '#0053FD',
      'layer-2': '#F2F6FF',
      'border-l1': 'rgba(0,83,253,0.22)',
      'sidebar': '#F3F7FF',
      'label-secondary': '#71717A',
      'overlay': '#FFFFFF',
      'border-l2': 'rgba(0,83,253,0.45)',
      'error': '#E5484D',
      'success': '#2E9E5B',
      'warn': '#D9920B',
    },
  },
  indigo: {
    label: '靛紫',
    brandDark: '#A28FF5',
    light: {
      'bg-base': '#FAF8FF',
      'label-primary': '#191620',
      'layer-1': '#FFFFFF',
      'brand-primary': '#6E56CF',
      'layer-2': '#F4F1FF',
      'border-l1': 'rgba(110,86,207,0.22)',
      'sidebar': '#F5F2FF',
      'label-secondary': '#6F6A80',
      'overlay': '#FFFFFF',
      'border-l2': 'rgba(110,86,207,0.45)',
      'error': '#E5484D',
      'success': '#2E9E5B',
      'warn': '#D9920B',
    },
  },
  emerald: {
    label: '翡翠绿',
    brandDark: '#4CC98F',
    light: {
      'bg-base': '#F6FDF9',
      'label-primary': '#131A17',
      'layer-1': '#FFFFFF',
      'brand-primary': '#0BA05E',
      'layer-2': '#EDFAF2',
      'border-l1': 'rgba(11,160,94,0.22)',
      'sidebar': '#F0FAF4',
      'label-secondary': '#68746E',
      'overlay': '#FFFFFF',
      'border-l2': 'rgba(11,160,94,0.45)',
      'error': '#E5484D',
      'success': '#0BA05E',
      'warn': '#D9920B',
    },
  },
}

export const PRESET_ORDER = ['default', 'nous', 'indigo', 'emerald']
export const PRESET_LABELS: Record<string, string> = { default: '系统默认', nous: 'Nous 蓝', indigo: '靛紫', emerald: '翡翠绿' }

// 自定义颜色字段（键 → 显示名）
export const FIELDS: Array<[string, string]> = [
  ['bg-base', '背景'],
  ['label-primary', '文字'],
  ['layer-1', '卡片'],
  ['brand-primary', '主色'],
  ['layer-2', '次级面'],
  ['border-l1', '边框'],
  ['sidebar', '侧边栏'],
  ['label-secondary', '次要文字'],
  ['overlay', '浮层背景'],
  ['border-l2', '强边框'],
  ['error', '错误色'],
  ['success', '成功色'],
  ['warn', '警告色'],
]

// 氛围光默认值（strength 0..1；breatheAmp 0..1 呼吸幅度；position 光晕布局）
export interface AmbientState {
  enabled: boolean
  strength: number
  breathe: boolean
  breatheAmp: number
  position: string
}

export const DEFAULT_AMBIENT: AmbientState = { enabled: true, strength: 0.08, breathe: true, breatheAmp: 0.9, position: 'tr-bl' }
export const POSITION_ORDER = ['tr-bl', 'tl-br', 'top', 'bottom', 'center']
export const POSITION_LABELS: Record<string, string> = { 'tr-bl': '右上·左下', 'tl-br': '左上·右下', top: '顶部', bottom: '底部', center: '居中' }

// 背景图开启时，这些"面"令牌被半透明化以透出图片（hex → rgba）。
// bg-base 是对话主区/应用框架/#root 的底色，需足够透明图才可见（0.3 = 透出 70%）
export const BG_FACE_ALPHA: Record<string, number> = { 'bg-base': 0.3, 'layer-1': 0.8, 'layer-2': 0.7, 'sidebar': 0.8, 'overlay': 0.88 }

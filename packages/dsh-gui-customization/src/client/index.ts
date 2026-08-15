/**
 * 版权声明 / Copyright
 *
 * - 主版权：Copyright (c) 2026 LAN-TINA-WS，项目以 MIT License 授权（见根目录 LICENSE）。
 * - 深色主题背景透明度修复：Copyright (c) 2026 FuturePioneer-3。
 *   本文件中的修改仅限「背景开启时对暗色面应用透明度」一处，其余代码版权归原作者所有。
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files, to deal in the Software
 * without restriction. See the LICENSE file for the full MIT license text.
 */

/**
 * GUICustomization（组合版）— Client 入口。
 *
 * 相对动态版（plugins/gui-customization）的能力差异：
 * - 持久化：localStorage（设置）+ IndexedDB（背景图 base64），无需 Host 半与工作区文件
 * - 背景图：真·文件选择对话框（input[type=file] + FileReader）+ body 属性正规方案
 *   （body[data-guic-bg] 属性选择器，scrim 用主题变量随明暗自适应）→ 主区真正透图
 * - 插件配置区识别：注册 settings.plugin.item 卡片（设置 → 插件）
 */
import { createElement, useEffect, useState } from 'react'
import {
  SOURCE, TOKEN_KEYS, DARK, PALETTES, PRESET_ORDER, PRESET_LABELS, FIELDS,
  DEFAULT_AMBIENT, POSITION_ORDER, POSITION_LABELS, BG_FACE_ALPHA, AmbientState,
} from './constants'
import {
  loadSettings, saveSettings, clearSettings,
  loadBackground, saveBackground, deleteBackground, BackgroundData,
  loadVideo, saveVideo, deleteVideo,
} from './store'
import { DICT_ZH, DICT_EN } from './i18n'
import { PRESET_BACKGROUNDS } from './assets.generated'

interface Ctx {
  get(name: string): unknown
  effect(fn: () => (() => void) | void): void
}
interface ThemeService {
  overrideTokens(source: string, tokens: Record<string, { light: string; dark: string }>): () => void
}
interface SlotsService {
  inject(key: string, cb: () => void): () => void
  register(options: Record<string, unknown>, render: (props: any) => unknown): unknown
}
interface LocaleService {
  register(ns: string, localeTag: string, dict: Record<string, string>): () => void
  bind(ns: string): (key: string) => string
  subscribe(fn: () => void): () => void
}

const MAIN_CSS = `
  .guic-panel { display: flex; flex-direction: column; gap: 14px; padding: 4px 0 16px; }
  .guic-h { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-secondary); }
  .guic-presets { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .guic-preset { padding: 6px 12px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); cursor: pointer; font-size: 13px; }
  .guic-preset:hover { border-color: var(--dsw-alias-brand-primary); }
  .guic-preset-active { border-color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-bg-layer-2); }
  .guic-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
  .guic-field { display: flex; align-items: center; gap: 8px; }
  .guic-field-label { width: 60px; flex: none; font-size: 12px; color: var(--dsw-alias-label-secondary); }
  .guic-field-color { width: 34px; height: 26px; padding: 0; border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px; background: none; cursor: pointer; }
  .guic-field-text { flex: 1; min-width: 0; padding: 4px 8px; font-size: 12px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); }
  .guic-actions { display: flex; gap: 8px; }
  .guic-btn { padding: 6px 14px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); cursor: pointer; font-size: 13px; }
  .guic-btn:hover { border-color: var(--dsw-alias-brand-primary); }
  .guic-btn-primary { background: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); color: #FFFFFF; }
  .guic-notice { font-size: 12px; color: var(--dsw-alias-brand-primary); }
  .guic-note { font-size: 12px; color: var(--dsw-alias-label-secondary); line-height: 1.6; }

  .guic-ambient { position: fixed; inset: 0; pointer-events: none; }
  .guic-ambient::before, .guic-ambient::after { content: ''; position: fixed; width: 55vmax; height: 55vmax; border-radius: 50%; filter: blur(50px); }
  .guic-ambient::before { top: -18vmax; right: -14vmax; background: radial-gradient(circle, color-mix(in srgb, var(--dsw-alias-brand-primary) calc(var(--guic-strength, 8) * 1%), transparent) 0%, transparent 70%); }
  .guic-ambient::after { bottom: -20vmax; left: -16vmax; background: radial-gradient(circle, color-mix(in srgb, var(--dsw-alias-brand-primary) calc(var(--guic-strength, 8) * 0.7%), transparent) 0%, transparent 70%); }
  .guic-ambient-breathe::before { animation: guic-breathe 8s ease-in-out infinite; }
  .guic-ambient-breathe::after { animation: guic-breathe 10s ease-in-out infinite reverse; }
  @keyframes guic-breathe { 0%, 100% { opacity: var(--guic-breathe-min, 0.6); } 50% { opacity: 1; } }
  .guic-ambient-pos-tl-br::before { top: -18vmax; right: auto; left: -14vmax; }
  .guic-ambient-pos-tl-br::after { bottom: -20vmax; left: auto; right: -16vmax; }
  .guic-ambient-pos-top::before { top: -24vmax; right: auto; left: 12vw; }
  .guic-ambient-pos-top::after { top: -24vmax; left: auto; right: 12vw; bottom: auto; }
  .guic-ambient-pos-bottom::before { bottom: -26vmax; top: auto; right: auto; left: 10vw; }
  .guic-ambient-pos-bottom::after { bottom: -26vmax; top: auto; left: auto; right: 10vw; }
  .guic-ambient-pos-center::before { top: 50%; left: 50%; right: auto; bottom: auto; transform: translate(-50%, -50%); width: 85vmax; height: 85vmax; }
  .guic-ambient-pos-center::after { display: none; }

  .guic-ambient-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .guic-check { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--dsw-alias-label-secondary); cursor: pointer; }
  .guic-range { flex: 1; min-width: 100px; accent-color: var(--dsw-alias-brand-primary); }

  .guic-plugin-card { padding: 12px 14px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; background: var(--dsw-alias-bg-layer-1); }
  .guic-plugin-name { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary); }
  .guic-plugin-desc { margin-top: 4px; font-size: 12px; color: var(--dsw-alias-label-secondary); line-height: 1.6; }

`

export function apply(ctx: Ctx) {
  const theme = ctx.get('theme') as ThemeService | undefined
  const slots = ctx.get('slots') as SlotsService | undefined
  if (theme === undefined || slots === undefined) return

  // 双语字典：注册进 locale 服务，t() 读当前语言；占位符 {name} 自行插值
  const locale = ctx.get('locale') as LocaleService | undefined
  let localeActiveLang: () => string = () => 'zh'
  if (locale !== undefined) {
    locale.register('gui-customization', 'zh', DICT_ZH)
    locale.register('gui-customization', 'en', DICT_EN)
    const localeAny = locale as unknown as { getLocale?: () => { active: string } }
    localeActiveLang = () => (localeAny.getLocale !== undefined ? localeAny.getLocale().active : 'zh')
  }
  const t = (key: string, vars?: Record<string, string | number>): string => {
    const en = DICT_EN[key]
    const template = (localeActiveLang() === 'en' && en !== undefined) ? en : (DICT_ZH[key] ?? key)
    if (vars === undefined) return template
    return template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? ''))
  }

  // 全局样式注入（组合版完整浏览器环境；ctx.effect 随插件卸载撤除）
  const mainTag = document.createElement('style')
  mainTag.dataset.plugin = 'dsh-gui-customization'
  mainTag.dataset.pluginCss = 'guic-main'
  mainTag.textContent = MAIN_CSS
  document.head.appendChild(mainTag)
  ctx.effect(() => () => { mainTag.remove() })

  // ---- 运行态状态（apply 闭包：面板与氛围层共享）----
  let activeLayer: (() => void) | null = null
  let currentColors: Record<string, string> = PALETTES.nous.light
  let currentBrandDark: string = PALETTES.nous.brandDark
  let userTouched = false
  let savedState: Record<string, unknown> | null = null
  const syncListeners: Array<() => void> = []

  let ambientState: AmbientState = { ...DEFAULT_AMBIENT }
  const ambientListeners: Array<(s: AmbientState) => void> = []
  function setAmbient(next: Partial<AmbientState>) {
    ambientState = { ...ambientState, ...next }
    ambientListeners.slice().forEach((fn) => fn(ambientState))
  }

  let bgEnabled = false
  let bgKind: 'image' | 'video' = 'image'
  let bgTag: HTMLStyleElement | null = null
  let videoLayer: HTMLDivElement | null = null
  let videoEl: HTMLVideoElement | null = null
  let videoUrl: string | null = null
  const bgListeners: Array<(enabled: boolean) => void> = []
  const bgKindListeners: Array<(kind: 'image' | 'video') => void> = []
  let bgSidebarTransparent = false
  const sidebarTransparentListeners: Array<(value: boolean) => void> = []
  let bgOpacity = 0.3
  const bgOpacityListeners: Array<(value: number) => void> = []
  function setBg(enabled: boolean) {
    bgEnabled = enabled
    bgListeners.slice().forEach((fn) => fn(enabled))
  }
  function setBgKind(kind: 'image' | 'video') {
    bgKind = kind
    bgKindListeners.slice().forEach((fn) => fn(kind))
  }
  function setBgSidebarTransparent(value: boolean) {
    bgSidebarTransparent = value
    sidebarTransparentListeners.slice().forEach((fn) => fn(value))
    renderTheme()
  }
  function setBgOpacity(value: number) {
    bgOpacity = Math.min(0.9, Math.max(0.1, value))
    bgOpacityListeners.slice().forEach((fn) => fn(bgOpacity))
    renderTheme()
  }
  ctx.effect(() => () => {
    if (bgTag !== null) { bgTag.remove(); bgTag = null }
    delete document.body.dataset.guicBg
    if (bgBlobUrl !== null) {
      try { URL.revokeObjectURL(bgBlobUrl) } catch { /* ignore */ }
      bgBlobUrl = null
    }
    removeVideoLayer()
  })

  // ---- 视频背景层（fixed 垫底：#root 之前插入，内容自然覆盖其上）----
  function ensureVideoLayer(): { layer: HTMLDivElement; video: HTMLVideoElement } {
    if (videoLayer !== null && videoEl !== null) return { layer: videoLayer, video: videoEl }
    videoLayer = document.createElement('div')
    videoLayer.dataset.plugin = 'dsh-gui-customization'
    videoLayer.dataset.pluginCss = 'guic-video'
    videoLayer.style.cssText = 'position: fixed; inset: 0; pointer-events: none; z-index: 0;'
    videoEl = document.createElement('video')
    videoEl.autoplay = true
    videoEl.muted = true
    videoEl.loop = true
    videoEl.setAttribute('playsinline', '')
    videoEl.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;'
    const scrim = document.createElement('div')
    scrim.style.cssText = 'position: absolute; inset: 0; background: linear-gradient(color-mix(in srgb, var(--dsw-alias-bg-layer-1) 88%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-bg-layer-1) 80%, transparent) 60%, color-mix(in srgb, var(--dsw-alias-bg-layer-1) 72%, transparent) 100%);'
    videoLayer.appendChild(videoEl)
    videoLayer.appendChild(scrim)
    const rootEl = document.getElementById('root')
    if (rootEl !== null) {
      document.body.insertBefore(videoLayer, rootEl)
    } else {
      document.body.appendChild(videoLayer)
    }
    return { layer: videoLayer, video: videoEl }
  }

  function removeVideoLayer() {
    if (videoUrl !== null) {
      try { URL.revokeObjectURL(videoUrl) } catch { /* ignore */ }
      videoUrl = null
    }
    if (videoEl !== null) {
      try { videoEl.pause() } catch { /* ignore */ }
      videoEl = null
    }
    if (videoLayer !== null) {
      videoLayer.remove()
      videoLayer = null
    }
  }

  // ---- 主题引擎 ----
  function buildTokens(
    light: Record<string, string>,
    brandDark: string,
    darkOverride?: Record<string, string>,
  ): Record<string, { light: string; dark: string }> {
    const dark: Record<string, string> = darkOverride ?? { ...DARK }
    dark['brand-primary'] = brandDark
    const tokens: Record<string, { light: string; dark: string }> = {}
    for (const key in TOKEN_KEYS) {
      tokens[TOKEN_KEYS[key]] = { light: light[key] ?? '', dark: dark[key] ?? '' }
    }
    return tokens
  }

  // hex / rgb() / rgba() → rgba(…, alpha)（其他格式原样返回）
  function withAlpha(value: string, alpha: number): string {
    const hex = /^#([0-9a-fA-F]{6})$/.exec(String(value))
    if (hex) {
      const r = parseInt(hex[1].slice(0, 2), 16)
      const g = parseInt(hex[1].slice(2, 4), 16)
      const b = parseInt(hex[1].slice(4, 6), 16)
      return `rgba(${r},${g},${b},${alpha})`
    }
    const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)$/.exec(String(value))
    if (rgb) {
      return `rgba(${rgb[1]},${rgb[2]},${rgb[3]},${alpha})`
    }
    return value
  }

  function translucent(colors: Record<string, string>): Record<string, string> {
    const next = { ...colors }
    for (const key in BG_FACE_ALPHA) {
      if (key === 'bg-base') {
        // 主区透明度由「背景透明度」滑块控制（10%–90%，默认 30%）
        next[key] = withAlpha(next[key] ?? '', bgOpacity)
      } else if (key === 'sidebar') {
        // 侧边栏透明度由用户开关控制：透明 0.55 / 非透明保持原值
        next[key] = bgSidebarTransparent ? withAlpha(next[key] ?? '', 0.55) : (next[key] ?? '')
      } else {
        next[key] = withAlpha(next[key] ?? '', BG_FACE_ALPHA[key])
      }
    }
    return next
  }

  // 撤销覆盖层后，从 body 计算值读回产品默认令牌值（DSH 主题变量定义在 body 上，
  // 供「系统默认+背景图」重建半透明层）
  function readProductTokens(): Record<string, string> {
    const style = getComputedStyle(document.body)
    const tokens: Record<string, string> = {}
    for (const key in TOKEN_KEYS) {
      const value = style.getPropertyValue(TOKEN_KEYS[key]).trim()
      if (value !== '') tokens[key] = value
    }
    // 读取失败（空）时回退 Nous 蓝默认，保证背景图下总有半透明层
    if (tokens['bg-base'] === undefined) {
      return { ...PALETTES.nous.light }
    }
    return tokens
  }

  function renderTheme() {
    const light = bgEnabled ? translucent(currentColors) : currentColors
    // 背景开启时，暗色面同样降透明度，否则深色主题下背景被不透明底色完全遮挡
    const dark = bgEnabled ? translucent({ ...DARK }) : undefined
    activeLayer = theme.overrideTokens(SOURCE, buildTokens(light, currentBrandDark, dark))
  }

  function applyColors(light: Record<string, string>, brandDark: string) {
    currentColors = light
    currentBrandDark = brandDark
    renderTheme()
  }

  function persist() {
    saveSettings({ colors: currentColors, brandDark: currentBrandDark, ambient: ambientState, bgKind, bgSidebarTransparent, bgOpacity })
  }

  // ---- 背景图引擎（body 属性正规方案，scrim 随明暗自适应）----
  // 图片经 Blob URL 呈现（规避浏览器 CSS data URL 约 2MB 长度限制——大图 data URL 会被整体丢弃）
  let bgBlobUrl: string | null = null

  function base64ToBlob(mime: string, data: string): Blob {
    const bin = atob(data)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return new Blob([bytes], { type: mime })
  }

  function buildBgCss(url: string): string {
    const scrim = 'linear-gradient(color-mix(in srgb, var(--dsw-alias-bg-layer-1) 97%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-bg-layer-1) 93%, transparent) 55%, color-mix(in srgb, var(--dsw-alias-bg-layer-1) 88%, transparent) 100%)'
    return [
      'body[data-guic-bg] {',
      '  background-color: var(--dsw-alias-bg-layer-1) !important;',
      `  background-image: ${scrim}, url("${url}");`,
      '  background-position: center;',
      '  background-size: cover;',
      '  background-attachment: fixed;',
      '  background-repeat: no-repeat;',
      '}',
    ].join('\n')
  }

  function applyBackgroundData(bg: BackgroundData) {
    // 互斥：图片与视频背景二选一
    clearVideoBackground()
    // base64 → Blob URL（大图不受 data URL 长度限制；失败回退 data URL 兜底）
    let url: string
    try {
      const blob = base64ToBlob(bg.mime, bg.data)
      if (bgBlobUrl !== null) {
        try { URL.revokeObjectURL(bgBlobUrl) } catch { /* ignore */ }
      }
      bgBlobUrl = URL.createObjectURL(blob)
      url = bgBlobUrl
    } catch {
      url = `data:${bg.mime};base64,${bg.data}`
    }
    if (bgTag === null) {
      bgTag = document.createElement('style')
      bgTag.dataset.plugin = 'dsh-gui-customization'
      bgTag.dataset.pluginCss = 'guic-bg'
      document.head.appendChild(bgTag)
    }
    bgTag.textContent = buildBgCss(url)
    document.body.dataset.guicBg = '1'
    setBg(true)
    setBgKind('image')
    renderTheme()
  }

  function clearBackground() {
    if (bgTag !== null) { bgTag.remove(); bgTag = null }
    delete document.body.dataset.guicBg
    if (bgBlobUrl !== null) {
      try { URL.revokeObjectURL(bgBlobUrl) } catch { /* ignore */ }
      bgBlobUrl = null
    }
    setBg(false)
    deleteBackground()
    renderTheme()
  }

  // ---- 视频背景引擎（video 垫底层 + scrim，Blob URL 播放）----
  function applyVideoData(file: Blob) {
    clearBackground()
    const { video } = ensureVideoLayer()
    if (videoUrl !== null) {
      try { URL.revokeObjectURL(videoUrl) } catch { /* ignore */ }
    }
    videoUrl = URL.createObjectURL(file)
    video.src = videoUrl
    void video.play().catch(() => { /* autoplay 失败则静默，用户可手动触发 */ })
    setBg(true)
    setBgKind('video')
    renderTheme()
  }

  function clearVideoBackground() {
    removeVideoLayer()
    if (bgKind === 'video') setBg(false)
    deleteVideo()
    if (bgKind === 'video') renderTheme()
  }

  // ---- 启动：默认配色 + 恢复存档 ----
  applyColors(PALETTES.nous.light, PALETTES.nous.brandDark)

  const saved = loadSettings()
  if (saved !== null && saved.colors !== undefined && typeof saved.colors === 'object') {
    savedState = saved
    applyColors(saved.colors as Record<string, string>, (saved.brandDark as string) || PALETTES.nous.brandDark)
    if (saved.ambient !== undefined && typeof saved.ambient === 'object') {
      setAmbient({ ...DEFAULT_AMBIENT, ...(saved.ambient as Partial<AmbientState>) })
    }
  }
  if (saved !== null && (saved.bgKind === 'video' || saved.bgKind === 'image')) {
    setBgKind(saved.bgKind as 'image' | 'video')
  }
  if (saved !== null && saved.bgSidebarTransparent === true) {
    setBgSidebarTransparent(true)
  }
  if (saved !== null && typeof saved.bgOpacity === 'number') {
    setBgOpacity(saved.bgOpacity as number)
  }
  void loadBackground().then((bg) => {
    if (bg !== null && !userTouched && bgKind === 'image') {
      applyBackgroundData(bg)
    }
  })
  void loadVideo().then((video) => {
    if (video !== null && !userTouched && bgKind === 'video') {
      applyVideoData(video)
    }
  })

  // ---- 组件 ----
  function AmbientLayer() {
    const [state, setState] = useState<AmbientState>(ambientState)
    useEffect(() => {
      const listener = (next: AmbientState) => setState({ ...next })
      ambientListeners.push(listener)
      return () => {
        const i = ambientListeners.indexOf(listener)
        if (i >= 0) ambientListeners.splice(i, 1)
      }
    }, [])
    if (!state.enabled) return null
    const position = POSITION_LABELS[state.position] !== undefined ? state.position : 'tr-bl'
    const cls = `guic-ambient guic-ambient-pos-${position}${state.breathe ? ' guic-ambient-breathe' : ''}`
    const strength = Math.min(100, Math.max(0, Math.round(state.strength * 100)))
    const amp = Math.min(1, Math.max(0, Number(state.breatheAmp) || 0))
    const breatheMin = Math.round((1 - amp * 0.45) * 100) / 100
    return createElement('div', {
      className: cls,
      style: { '--guic-strength': String(strength), '--guic-breathe-min': String(breatheMin) },
    })
  }

  function GuiPanel() {
    const [colors, setColors] = useState<Record<string, string>>(PALETTES.nous.light)
    const [brandDark, setBrandDark] = useState<string>(PALETTES.nous.brandDark)
    const [activePreset, setActivePreset] = useState<string>('nous')
    const [notice, setNotice] = useState<string>(t('notice.defaultApplied', { name: t('preset.nous') }))
    const [ambient, setAmbientUi] = useState<AmbientState>(ambientState)
    const [bg, setBgUi] = useState<boolean>(bgEnabled)
    const [bgKindUi, setBgKindUi] = useState<'image' | 'video'>(bgKind)
    const [sidebarTransparentUi, setSidebarTransparentUi] = useState<boolean>(bgSidebarTransparent)
    const [bgOpacityUi, setBgOpacityUi] = useState<number>(bgOpacity)
    const [langTick, setLangTick] = useState<number>(0)
    const [ioText, setIoText] = useState<string>('')

    useEffect(() => {
      if (locale === undefined) return
      const off = locale.subscribe(() => setLangTick((x) => x + 1))
      return off
    }, [])
    void langTick

    useEffect(() => {
      const sync = () => {
        if (savedState === null || userTouched) return
        setColors(savedState.colors as Record<string, string>)
        setBrandDark((savedState.brandDark as string) || PALETTES.nous.brandDark)
        setActivePreset(null as unknown as string)
        setNotice(t('notice.loaded'))
      }
      syncListeners.push(sync)
      sync()
      return () => {
        const i = syncListeners.indexOf(sync)
        if (i >= 0) syncListeners.splice(i, 1)
      }
    }, [])

    useEffect(() => {
      const listener = (next: AmbientState) => setAmbientUi({ ...next })
      ambientListeners.push(listener)
      return () => {
        const i = ambientListeners.indexOf(listener)
        if (i >= 0) ambientListeners.splice(i, 1)
      }
    }, [])

    useEffect(() => {
      const listener = (enabled: boolean) => setBgUi(enabled)
      bgListeners.push(listener)
      return () => {
        const i = bgListeners.indexOf(listener)
        if (i >= 0) bgListeners.splice(i, 1)
      }
    }, [])

    useEffect(() => {
      const listener = (kind: 'image' | 'video') => setBgKindUi(kind)
      bgKindListeners.push(listener)
      return () => {
        const i = bgKindListeners.indexOf(listener)
        if (i >= 0) bgKindListeners.splice(i, 1)
      }
    }, [])

    useEffect(() => {
      const listener = (value: boolean) => setSidebarTransparentUi(value)
      sidebarTransparentListeners.push(listener)
      return () => {
        const i = sidebarTransparentListeners.indexOf(listener)
        if (i >= 0) sidebarTransparentListeners.splice(i, 1)
      }
    }, [])

    useEffect(() => {
      const listener = (value: number) => setBgOpacityUi(value)
      bgOpacityListeners.push(listener)
      return () => {
        const i = bgOpacityListeners.indexOf(listener)
        if (i >= 0) bgOpacityListeners.splice(i, 1)
      }
    }, [])

    const update = (key: string, value: string) => {
      userTouched = true
      setColors((prev) => ({ ...prev, [key]: value }))
      setActivePreset('')
    }

    const updateAmbient = (patch: Partial<AmbientState>) => {
      userTouched = true
      setAmbient(patch)
      persist()
    }

    // 文件读取序号：快速连选多个文件时，丢弃过期结果（防竞态覆盖）
    let fileSeq = 0

    const handleFile = (file: File) => {
      userTouched = true
      const seq = ++fileSeq
      const reader = new FileReader()
      reader.onload = () => {
        if (seq !== fileSeq) return
        const dataUrl = String(reader.result)
        const m = /^data:([a-z0-9.+-]+\/[a-z0-9.+-]+);base64,(.*)$/.exec(dataUrl)
        if (m === null) {
          setNotice(t('notice.bgReadError') + '（格式解析失败）')
          return
        }
        const bgData = { mime: m[1], data: m[2] }
        applyBackgroundData(bgData)
        saveBackground(bgData)
        persist()
        setNotice(t('notice.bgApplied'))
      }
      reader.onerror = () => {
        if (seq !== fileSeq) return
        const detail = reader.error !== null && reader.error.message !== undefined ? String(reader.error.message) : ''
        setNotice(t('notice.bgReadError') + (detail !== '' ? '：' + detail : ''))
      }
      try {
        reader.readAsDataURL(file)
      } catch (error) {
        if (seq === fileSeq) setNotice(t('notice.bgReadError') + '：' + String(error))
      }
    }

    const handleVideoFile = (file: File) => {
      userTouched = true
      const seq = ++fileSeq
      applyVideoData(file)
      saveVideo(file)
      persist()
      if (seq === fileSeq) setNotice(t('notice.videoApplied'))
    }

    const choosePreset = (key: string) => () => {
      userTouched = true
      setActivePreset(key)
      if (key === 'default') {
        setAmbient({ ...DEFAULT_AMBIENT })
        clearSettings()
        if (activeLayer !== null) {
          activeLayer()
          activeLayer = null
        }
        if (bgEnabled) {
          // 背景图保留：读回产品默认令牌值，用半透明版重建（配色回默认 + 面板仍透图）
          const product = readProductTokens()
          setColors(product)
          applyColors(product, currentBrandDark)
          setNotice(t('notice.bgReadback', { value: String(product['bg-base'] ?? '?') }))
        } else {
          setNotice(t('notice.systemDefault'))
        }
        return
      }
      const p = PALETTES[key]
      if (p === undefined) return
      setColors(p.light)
      setBrandDark(p.brandDark)
      applyColors(p.light, p.brandDark)
      persist()
      setNotice(t('notice.appliedPreset', { name: p.label }))
    }

    const applyCustom = () => {
      userTouched = true
      applyColors(colors, brandDark)
      persist()
      setActivePreset('')
      setNotice(t('notice.customApplied'))
    }

    const doExport = () => {
      userTouched = true
      const text = JSON.stringify({ colors, brandDark, ambient: ambientState }, null, 2)
      setIoText(text)
      if (typeof navigator !== 'undefined' && navigator.clipboard !== undefined && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(text).then(
          () => setNotice(t('io.copied')),
          () => setNotice(t('io.exported')),
        )
      } else {
        setNotice(t('io.exported'))
      }
    }

    const doImport = () => {
      userTouched = true
      let parsed: Record<string, unknown>
      try {
        parsed = JSON.parse(ioText)
      } catch {
        setNotice(t('io.importFail'))
        return
      }
      if (parsed === null || typeof parsed !== 'object' || parsed.colors === null || typeof parsed.colors !== 'object') {
        setNotice(t('io.importFail'))
        return
      }
      const newColors = parsed.colors as Record<string, string>
      const merged: Record<string, string> = { ...colors }
      for (const key in TOKEN_KEYS) {
        if (typeof newColors[key] === 'string' && newColors[key] !== '') merged[key] = newColors[key]
      }
      const newBrandDark = (typeof parsed.brandDark === 'string' && parsed.brandDark !== '') ? parsed.brandDark : brandDark
      const newAmbient: AmbientState = (parsed.ambient !== null && typeof parsed.ambient === 'object')
        ? { ...DEFAULT_AMBIENT, ...(parsed.ambient as Partial<AmbientState>) }
        : ambientState
      setColors(merged)
      setBrandDark(newBrandDark)
      setAmbient(newAmbient)
      applyColors(merged, newBrandDark)
      persist()
      setActivePreset('')
      setNotice(t('io.imported'))
    }

    return createElement('div', { className: 'guic-panel' },
      createElement('div', { className: 'guic-h' }, t('group.presets')),
      createElement('div', { className: 'guic-presets' },
        PRESET_ORDER.map((key) => createElement('button', {
          key,
          className: activePreset === key ? 'guic-preset guic-preset-active' : 'guic-preset',
          onClick: choosePreset(key),
        }, t('preset.' + key))),
      ),
      createElement('div', { className: 'guic-h' }, t('group.colors')),
      createElement('div', { className: 'guic-grid' },
        FIELDS.map(([key, label]) => {
          const value = colors[key] ?? ''
          const hex = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#0053FD'
          return createElement('div', { className: 'guic-field', key },
            createElement('span', { className: 'guic-field-label' }, t('field.' + key)),
            createElement('input', {
              type: 'color',
              className: 'guic-field-color',
              value: hex,
              onChange: (ev: any) => update(key, String(ev.target.value)),
            }),
            createElement('input', {
              type: 'text',
              className: 'guic-field-text',
              value,
              onChange: (ev: any) => update(key, String(ev.target.value)),
            }),
          )
        }),
      ),
      createElement('div', { className: 'guic-actions' },
        createElement('button', { className: 'guic-btn guic-btn-primary', onClick: applyCustom }, t('action.applyColors')),
        createElement('button', { className: 'guic-btn', onClick: doExport }, t('io.export')),
        createElement('button', { className: 'guic-btn', onClick: doImport }, t('io.import')),
      ),
      createElement('div', { className: 'guic-ambient-row' },
        createElement('textarea', {
          className: 'guic-field-text',
          rows: 4,
          value: ioText,
          onChange: (ev: any) => setIoText(String(ev.target.value)),
          placeholder: t('io.placeholder'),
          style: { width: '100%', minHeight: '64px', resize: 'vertical', fontFamily: 'monospace', fontSize: '11px' },
        }),
      ),
      createElement('div', { className: 'guic-h' }, t('group.ambient')),
      createElement('div', { className: 'guic-ambient-row' },
        createElement('button', {
          className: ambient.enabled ? 'guic-btn guic-btn-primary' : 'guic-btn',
          onClick: () => updateAmbient({ enabled: !ambient.enabled }),
        }, ambient.enabled ? t('ambient.on') : t('ambient.off')),
        createElement('label', { className: 'guic-check' },
          createElement('input', {
            type: 'checkbox',
            checked: ambient.breathe,
            onChange: (ev: any) => updateAmbient({ breathe: Boolean(ev.target.checked) }),
          }),
          t('ambient.breathe'),
        ),
      ),
      createElement('div', { className: 'guic-ambient-row' },
        createElement('span', { className: 'guic-field-label' }, t('ambient.strength')),
        createElement('input', {
          type: 'range',
          min: 0,
          max: 40,
          className: 'guic-range',
          value: Math.round(ambient.strength * 100),
          onChange: (ev: any) => updateAmbient({ strength: Number(ev.target.value) / 100 }),
        }),
        createElement('span', { className: 'guic-note' }, `${Math.round(ambient.strength * 100)}%`),
      ),
      createElement('div', { className: 'guic-ambient-row' },
        createElement('span', { className: 'guic-field-label' }, t('ambient.breath')),
        createElement('input', {
          type: 'range',
          min: 0,
          max: 100,
          className: 'guic-range',
          value: Math.round((Number(ambient.breatheAmp) || 0) * 100),
          onChange: (ev: any) => updateAmbient({ breatheAmp: Number(ev.target.value) / 100 }),
        }),
        createElement('span', { className: 'guic-note' }, `${Math.round((Number(ambient.breatheAmp) || 0) * 100)}%`),
      ),
      createElement('div', { className: 'guic-ambient-row' },
        createElement('span', { className: 'guic-field-label' }, t('ambient.position')),
        POSITION_ORDER.map((key) => createElement('button', {
          key,
          className: ambient.position === key ? 'guic-preset guic-preset-active' : 'guic-preset',
          onClick: () => updateAmbient({ position: key }),
        }, t('pos.' + key))),
      ),
      createElement('div', { className: 'guic-h' }, t('group.bg')),
      createElement('div', { className: 'guic-ambient-row' },
        createElement('span', { className: 'guic-field-label' }, t('bg.status')),
        createElement('span', { className: 'guic-note' }, bg ? t('ambient.on') : t('ambient.off')),
        createElement('label', { className: 'guic-btn guic-btn-primary' },
          createElement('input', {
            type: 'file',
            accept: 'image/*',
            style: { display: 'none' },
            onChange: (ev: any) => {
              const file = ev.target !== null && ev.target.files !== null && ev.target.files.length > 0 ? ev.target.files[0] : null
              if (file !== null) handleFile(file)
            },
          }),
          t('bg.choose'),
        ),
        createElement('button', { className: 'guic-btn', onClick: clearBackground }, t('bg.clear')),
      ),
      createElement('div', { className: 'guic-ambient-row' },
        createElement('span', { className: 'guic-field-label' }, t('bg.preset')),
        Object.keys(PRESET_BACKGROUNDS).map((key) => createElement('button', {
          key,
          className: 'guic-preset',
          onClick: () => {
            const bgData = PRESET_BACKGROUNDS[key]
            if (bgData === undefined) return
            userTouched = true
            applyBackgroundData(bgData)
            saveBackground(bgData)
            persist()
            setNotice(t('notice.bgApplied'))
          },
        }, t('bg.preset.' + key))),
      ),
      createElement('div', { className: 'guic-ambient-row' },
        createElement('span', { className: 'guic-field-label' }, t('bg.video.status')),
        createElement('span', { className: 'guic-note' }, bgKindUi === 'video' && bg ? t('ambient.on') : t('ambient.off')),
        createElement('label', { className: 'guic-btn guic-btn-primary' },
          createElement('input', {
            type: 'file',
            accept: 'video/*',
            style: { display: 'none' },
            onChange: (ev: any) => {
              const file = ev.target !== null && ev.target.files !== null && ev.target.files.length > 0 ? ev.target.files[0] : null
              if (file !== null) handleVideoFile(file)
            },
          }),
          t('bg.video.choose'),
        ),
        createElement('button', { className: 'guic-btn', onClick: () => {
          userTouched = true
          clearVideoBackground()
          persist()
          setNotice(t('notice.bgCleared'))
        } }, t('bg.video.clear')),
      ),
      createElement('div', { className: 'guic-ambient-row' },
        createElement('label', { className: 'guic-check' },
          createElement('input', {
            type: 'checkbox',
            checked: sidebarTransparentUi,
            onChange: (ev: any) => {
              userTouched = true
              setBgSidebarTransparent(Boolean(ev.target.checked))
              persist()
            },
          }),
          t('bg.sidebarTransparent'),
        ),
      ),
      createElement('div', { className: 'guic-ambient-row' },
        createElement('span', { className: 'guic-field-label' }, t('bg.opacity')),
        createElement('input', {
          type: 'range',
          min: 10,
          max: 90,
          className: 'guic-range',
          value: Math.round(bgOpacityUi * 100),
          onChange: (ev: any) => {
            userTouched = true
            setBgOpacity(Number(ev.target.value) / 100)
            persist()
          },
        }),
        createElement('span', { className: 'guic-note' }, `${Math.round(bgOpacityUi * 100)}%`),
      ),
      createElement('div', { className: 'guic-note' },
        t('bg.note'),
      ),
      createElement('div', { className: 'guic-notice' }, notice),
      createElement('div', { className: 'guic-note' },
        t('hint.persist'),
      ),
    )
  }

  function PluginCard() {
    return createElement('div', { className: 'guic-plugin-card' },
      createElement('div', { className: 'guic-plugin-name' }, t('plugin.name')),
      createElement('div', { className: 'guic-plugin-desc' }, t('plugin.desc')),
    )
  }

  // ---- 设置导航图标增强（插件框架内手术式方案：失效静默降级为齿轮）----
  const NAV_ICON_SVG = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><rect x="2.2" y="3.2" width="11.6" height="9.6" rx="1.8"/><path d="M5 6.7l1.8 1.8-1.8 1.8"/><path d="M9 10.3h2.6"/></svg>'

  function enhanceNavIcon() {
    // 已应用且标记仍在（产品未重渲染）→ 跳过
    if (document.querySelector('[data-guic-nav-icon="1"]') !== null) return
    const dialog = document.querySelector('[role="dialog"]')
    if (dialog === null) return
    const labels = [DICT_ZH['nav.label'], DICT_EN['nav.label']]
    const buttons = Array.from(dialog.querySelectorAll('button'))
    for (const btn of buttons) {
      const text = (btn.textContent ?? '').trim()
      if (!labels.includes(text)) continue
      const svg = btn.querySelector('svg')
      if (svg === null) continue
      const wrap = document.createElement('span')
      wrap.innerHTML = NAV_ICON_SVG
      const iconEl = wrap.firstElementChild
      if (iconEl === null) continue
      iconEl.setAttribute('data-guic-nav-icon', '1')
      svg.replaceWith(iconEl)
      return
    }
  }

  const navObserver = new MutationObserver(() => { enhanceNavIcon() })
  navObserver.observe(document.body, { childList: true, subtree: true })
  enhanceNavIcon()
  ctx.effect(() => () => { navObserver.disconnect() })

  // ---- 槽位注册 ----
  slots.inject('settings.section', () => slots.register(
    { name: 'settings.section', id: 'gui-customization', order: 5, label: () => t('nav.label') },
    () => createElement(GuiPanel),
  ))
  slots.inject('shell.overlay', () => slots.register(
    { name: 'shell.overlay', id: 'guic-ambient', order: 0 },
    () => createElement(AmbientLayer),
  ))
  slots.inject('settings.plugin.item', () => slots.register(
    { name: 'settings.plugin.item', id: 'gui-customization', order: 30, label: () => t('nav.label') },
    () => createElement(PluginCard),
  ))
}

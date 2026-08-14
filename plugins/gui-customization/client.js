// ============================================================================
// GUICustomization v7 — Client 半（此文件全部内容 = cordis_define 的 code.client）
// v7 新增：背景图文件选择器 —— workspaces.pickDirectory 原生目录选择 +
// Host list-files 列出图片文件按钮，点选即应用；保留手动路径输入。
// v6 修复：底色面透明化（bg-base 0.3）+ scrim 换基色 + !important。
// ============================================================================

// 覆盖层唯一 source（同 source 重调 = 整层替换并置顶）
const SOURCE = 'gui-customization'

// 颜色字段 → 主题令牌
const TOKEN_KEYS = {
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
const DARK = {
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

// 预设配色（light 部分；dark 用 DARK + brandDark）
const PALETTES = {
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

const PRESET_ORDER = ['default', 'nous', 'indigo', 'emerald']
const PRESET_LABELS = { default: '系统默认', nous: 'Nous 蓝', indigo: '靛紫', emerald: '翡翠绿' }

const FIELDS = [
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
const DEFAULT_AMBIENT = { enabled: true, strength: 0.08, breathe: true, breatheAmp: 0.9, position: 'tr-bl' }
const POSITION_ORDER = ['tr-bl', 'tl-br', 'top', 'bottom', 'center']
const POSITION_LABELS = { 'tr-bl': '右上·左下', 'tl-br': '左上·右下', top: '顶部', bottom: '底部', center: '居中' }

// 背景图默认值（存档只存 enabled + path）
const DEFAULT_BACKGROUND = { enabled: false, path: '' }

// 背景图开启时，这些"面"令牌被半透明化以透出图片（hex → rgba）。
// bg-base 是对话主区/应用框架/#root 的底色，需足够透明图才可见（0.3 = 透出 70%）
const BG_FACE_ALPHA = { 'bg-base': 0.3, 'layer-1': 0.8, 'layer-2': 0.7, 'sidebar': 0.8, 'overlay': 0.88 }

return {
  apply(ctx) {
    const theme = ctx.get('theme')
    const slots = ctx.get('slots')
    const workspaces = ctx.get('workspaces')
    if (theme === undefined || slots === undefined) return

    styles.insert(`
      .guic-panel { display: flex; flex-direction: column; gap: 14px; padding: 4px 0 16px; }
      .guic-h { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-secondary); }
      .guic-presets { display: flex; gap: 8px; flex-wrap: wrap; }
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

      /* 氛围层：全屏点击穿透光晕，颜色随主题 brand-primary，强度由 --guic-strength 驱动 */
      .guic-ambient { position: fixed; inset: 0; pointer-events: none; }
      .guic-ambient::before, .guic-ambient::after { content: ''; position: fixed; width: 55vmax; height: 55vmax; border-radius: 50%; filter: blur(50px); }
      .guic-ambient::before { top: -18vmax; right: -14vmax; background: radial-gradient(circle, color-mix(in srgb, var(--dsw-alias-brand-primary) calc(var(--guic-strength, 8) * 1%), transparent) 0%, transparent 70%); }
      .guic-ambient::after { bottom: -20vmax; left: -16vmax; background: radial-gradient(circle, color-mix(in srgb, var(--dsw-alias-brand-primary) calc(var(--guic-strength, 8) * 0.7%), transparent) 0%, transparent 70%); }
      .guic-ambient-breathe::before { animation: guic-breathe 8s ease-in-out infinite; }
      .guic-ambient-breathe::after { animation: guic-breathe 10s ease-in-out infinite reverse; }
      @keyframes guic-breathe { 0%, 100% { opacity: var(--guic-breathe-min, 0.6); } 50% { opacity: 1; } }

      /* 光晕位置模式（默认右上+左下，无类即此布局） */
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
    `)

    // 当前有效覆盖层的 disposer（同 source 重调后旧 disposer 自动失效）
    let activeLayer = null
    // 当前生效配色（背景图开启时渲染为半透明版）
    let currentColors = PALETTES.nous.light
    let currentBrandDark = PALETTES.nous.brandDark
    // 用户是否已在本会话操作过（操作后不再用延迟到达的存档覆盖）
    let userTouched = false
    // 从 Host 半加载到的存档配色
    let savedState = null
    const syncListeners = []

    // 氛围光状态（apply 闭包共享：面板与氛围层实时同步）
    let ambientState = Object.assign({}, DEFAULT_AMBIENT)
    const ambientListeners = []
    function setAmbient(next) {
      ambientState = Object.assign({}, ambientState, next)
      ambientListeners.slice().forEach((fn) => fn(ambientState))
    }

    // 背景图状态与 CSS 层
    let bgState = Object.assign({}, DEFAULT_BACKGROUND)
    const bgListeners = []
    let disposeBgCss = null
    function setBg(next) {
      bgState = Object.assign({}, bgState, next)
      bgListeners.slice().forEach((fn) => fn(bgState))
    }

    function buildTokens(light, brandDark) {
      const dark = Object.assign({}, DARK)
      dark['brand-primary'] = brandDark
      const tokens = {}
      for (const key in TOKEN_KEYS) {
        tokens[TOKEN_KEYS[key]] = { light: light[key], dark: dark[key] }
      }
      return tokens
    }

    // hex → rgba（仅 6 位 hex；其他格式原样返回）
    function withAlpha(value, alpha) {
      const m = /^#([0-9a-fA-F]{6})$/.exec(String(value))
      if (!m) return value
      const r = parseInt(m[1].slice(0, 2), 16)
      const g = parseInt(m[1].slice(2, 4), 16)
      const b = parseInt(m[1].slice(4, 6), 16)
      return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')'
    }

    function translucent(colors) {
      const next = Object.assign({}, colors)
      for (const key in BG_FACE_ALPHA) {
        next[key] = withAlpha(next[key], BG_FACE_ALPHA[key])
      }
      return next
    }

    function renderTheme() {
      const light = bgState.enabled ? translucent(currentColors) : currentColors
      activeLayer = theme.overrideTokens(SOURCE, buildTokens(light, currentBrandDark))
    }

    function applyColors(light, brandDark) {
      currentColors = light
      currentBrandDark = brandDark
      renderTheme()
    }

    function persist(state) {
      userTouched = true
      host.call('save', state).catch(() => {})
    }

    // 背景图 CSS（body 背景：底色 + scrim 遮罩 + 图片；基色用 layer-1 随明暗自适应；
    // !important 防产品 background 声明覆盖）
    function buildBgCss(mime, data) {
      const url = 'url("data:' + mime + ';base64,' + data + '")'
      const scrim = 'linear-gradient(color-mix(in srgb, var(--dsw-alias-bg-layer-1) 97%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-bg-layer-1) 93%, transparent) 55%, color-mix(in srgb, var(--dsw-alias-bg-layer-1) 88%, transparent) 100%)'
      return [
        'body {',
        '  background-color: var(--dsw-alias-bg-layer-1) !important;',
        '  background-image: ' + scrim + ', ' + url + ' !important;',
        '  background-position: center !important;',
        '  background-size: cover !important;',
        '  background-attachment: fixed !important;',
        '  background-repeat: no-repeat !important;',
        '}',
      ].join('\n')
    }

    async function applyBackground(path) {
      const reply = await host.call('load-image', { path }).catch(() => null)
      if (reply === null || reply.ok !== true) {
        return { ok: false, error: (reply !== null && reply.error) ? String(reply.error) : '图片读取失败' }
      }
      if (disposeBgCss !== null) {
        disposeBgCss()
        disposeBgCss = null
      }
      disposeBgCss = styles.insert(buildBgCss(String(reply.mime), String(reply.data)))
      setBg({ enabled: true, path: String(path) })
      renderTheme()
      return { ok: true }
    }

    function clearBackground() {
      if (disposeBgCss !== null) {
        disposeBgCss()
        disposeBgCss = null
      }
      setBg({ enabled: false, path: '' })
      renderTheme()
    }

    // 默认配色：插件加载立即生效
    applyColors(PALETTES.nous.light, PALETTES.nous.brandDark)

    // 启动恢复：读取上次保存的配色、氛围与背景图（用户已操作则跳过）
    host.call('load').then((saved) => {
      if (saved !== null && saved !== undefined && typeof saved === 'object' && saved.colors !== undefined && !userTouched) {
        savedState = saved
        applyColors(saved.colors, saved.brandDark || PALETTES.nous.brandDark)
        if (saved.ambient !== null && saved.ambient !== undefined && typeof saved.ambient === 'object') {
          setAmbient(Object.assign({}, DEFAULT_AMBIENT, saved.ambient))
        }
        if (saved.background !== null && saved.background !== undefined && typeof saved.background === 'object' && saved.background.enabled === true && typeof saved.background.path === 'string' && saved.background.path !== '') {
          applyBackground(saved.background.path).catch(() => {})
        }
        syncListeners.slice().forEach((fn) => fn())
      }
    }).catch(() => {})

    // 氛围层组件（shell.overlay，点击穿透）
    function AmbientLayer() {
      const [state, setState] = React.useState(ambientState)
      React.useEffect(() => {
        const listener = (next) => setState(Object.assign({}, next))
        ambientListeners.push(listener)
        return () => {
          const i = ambientListeners.indexOf(listener)
          if (i >= 0) ambientListeners.splice(i, 1)
        }
      }, [])
      if (!state.enabled) return null
      const position = state.position !== undefined && POSITION_LABELS[state.position] !== undefined ? state.position : 'tr-bl'
      const cls = 'guic-ambient guic-ambient-pos-' + position + (state.breathe ? ' guic-ambient-breathe' : '')
      const strength = Math.min(100, Math.max(0, Math.round(state.strength * 100)))
      const amp = Math.min(1, Math.max(0, Number(state.breatheAmp) || 0))
      const breatheMin = Math.round((1 - amp * 0.45) * 100) / 100
      return React.createElement('div', {
        className: cls,
        style: { '--guic-strength': String(strength), '--guic-breathe-min': String(breatheMin) },
      })
    }

    function GuiPanel() {
      const [colors, setColors] = React.useState(PALETTES.nous.light)
      const [brandDark, setBrandDark] = React.useState(PALETTES.nous.brandDark)
      const [activePreset, setActivePreset] = React.useState('nous')
      const [notice, setNotice] = React.useState('默认「Nous 蓝」配色已应用')
      const [ambient, setAmbientUi] = React.useState(ambientState)
      const [bg, setBgUi] = React.useState(bgState)
      const [bgPath, setBgPath] = React.useState(bgState.path)
      const [browseDir, setBrowseDir] = React.useState('')
      const [browseFiles, setBrowseFiles] = React.useState([])

      React.useEffect(() => {
        const sync = () => {
          if (savedState === null || userTouched) return
          setColors(savedState.colors)
          setBrandDark(savedState.brandDark || PALETTES.nous.brandDark)
          setActivePreset(null)
          setNotice('已加载保存的配色')
        }
        syncListeners.push(sync)
        sync()
        return () => {
          const i = syncListeners.indexOf(sync)
          if (i >= 0) syncListeners.splice(i, 1)
        }
      }, [])

      React.useEffect(() => {
        const listener = (next) => setAmbientUi(Object.assign({}, next))
        ambientListeners.push(listener)
        return () => {
          const i = ambientListeners.indexOf(listener)
          if (i >= 0) ambientListeners.splice(i, 1)
        }
      }, [])

      React.useEffect(() => {
        const listener = (next) => {
          setBgUi(Object.assign({}, next))
          setBgPath(next.path)
        }
        bgListeners.push(listener)
        return () => {
          const i = bgListeners.indexOf(listener)
          if (i >= 0) bgListeners.splice(i, 1)
        }
      }, [])

      const update = (key, value) => {
        userTouched = true
        setColors((prev) => {
          const next = Object.assign({}, prev)
          next[key] = value
          return next
        })
        setActivePreset(null)
      }

      const updateAmbient = (patch) => {
        userTouched = true
        setAmbient(patch)
        host.call('save', { colors, brandDark, ambient: ambientState, background: bgState }).catch(() => {})
      }

      const onApplyBg = () => {
        userTouched = true
        applyBackground(bgPath).then((r) => {
          if (r.ok) {
            persist({ colors, brandDark, ambient: ambientState, background: bgState })
            setNotice('背景图已应用')
          } else {
            setNotice('背景图加载失败：' + r.error)
          }
        })
      }

      const onClearBg = () => {
        userTouched = true
        clearBackground()
        persist({ colors, brandDark, ambient: ambientState, background: bgState })
        setNotice('背景图已清除')
      }

      // 原生目录选择器 → 列出该目录中的图片文件
      const pickImage = () => {
        userTouched = true
        if (workspaces === undefined) return
        workspaces.pickDirectory().then((dir) => {
          if (dir === null || dir === '') return
          return host.call('list-files', { path: dir }).then((reply) => {
            if (reply !== null && reply !== undefined && reply.ok === true) {
              setBrowseDir(String(dir))
              setBrowseFiles(Array.isArray(reply.files) ? reply.files : [])
              if (!Array.isArray(reply.files) || reply.files.length === 0) {
                setNotice('该目录没有图片文件（png/jpg/webp/gif）')
              }
            } else {
              setNotice('目录读取失败：' + ((reply !== null && reply !== undefined && reply.error) ? String(reply.error) : '未知错误'))
            }
          })
        }).catch(() => { setNotice('目录选择失败') })
      }

      const onPickFile = (filePath) => {
        userTouched = true
        setBgPath(filePath)
        applyBackground(filePath).then((r) => {
          if (r.ok) {
            persist({ colors, brandDark, ambient: ambientState, background: bgState })
            setNotice('背景图已应用')
          } else {
            setNotice('背景图加载失败：' + r.error)
          }
        })
      }

      const choosePreset = (key) => () => {
        userTouched = true
        setActivePreset(key)
        if (key === 'default') {
          if (activeLayer !== null) {
            activeLayer()
            activeLayer = null
          }
          setAmbient(DEFAULT_AMBIENT)
          clearBackground()
          persist(null)
          setNotice('已还原系统默认')
          return
        }
        const p = PALETTES[key]
        setColors(p.light)
        setBrandDark(p.brandDark)
        applyColors(p.light, p.brandDark)
        persist({ colors: p.light, brandDark: p.brandDark, ambient: ambientState, background: bgState })
        setNotice('已应用「' + p.label + '」')
      }

      const applyCustom = () => {
        userTouched = true
        applyColors(colors, brandDark)
        persist({ colors, brandDark, ambient: ambientState, background: bgState })
        setActivePreset(null)
        setNotice('已应用并保存自定义配色')
      }

      return React.createElement('div', { className: 'guic-panel' },
        React.createElement('div', { className: 'guic-h' }, '预设配色'),
        React.createElement('div', { className: 'guic-presets' },
          PRESET_ORDER.map((key) => React.createElement('button', {
            key,
            className: activePreset === key ? 'guic-preset guic-preset-active' : 'guic-preset',
            onClick: choosePreset(key),
          }, PRESET_LABELS[key])),
        ),
        React.createElement('div', { className: 'guic-h' }, '自定义颜色（应用后生效）'),
        React.createElement('div', { className: 'guic-grid' },
          FIELDS.map((pair) => {
            const key = pair[0]
            const label = pair[1]
            const value = colors[key]
            const hex = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#0053FD'
            return React.createElement('div', { className: 'guic-field', key },
              React.createElement('span', { className: 'guic-field-label' }, label),
              React.createElement('input', {
                type: 'color',
                className: 'guic-field-color',
                value: hex,
                onChange: (ev) => update(key, ev.target.value),
              }),
              React.createElement('input', {
                type: 'text',
                className: 'guic-field-text',
                value,
                onChange: (ev) => update(key, ev.target.value),
              }),
            )
          }),
        ),
        React.createElement('div', { className: 'guic-actions' },
          React.createElement('button', { className: 'guic-btn guic-btn-primary', onClick: applyCustom }, '应用配色'),
        ),
        React.createElement('div', { className: 'guic-h' }, '氛围光（实时生效）'),
        React.createElement('div', { className: 'guic-ambient-row' },
          React.createElement('button', {
            className: ambient.enabled ? 'guic-btn guic-btn-primary' : 'guic-btn',
            onClick: () => updateAmbient({ enabled: !ambient.enabled }),
          }, ambient.enabled ? '已开启' : '已关闭'),
          React.createElement('label', { className: 'guic-check' },
            React.createElement('input', {
              type: 'checkbox',
              checked: ambient.breathe,
              onChange: (ev) => updateAmbient({ breathe: ev.target.checked }),
            }),
            '呼吸动画',
          ),
        ),
        React.createElement('div', { className: 'guic-ambient-row' },
          React.createElement('span', { className: 'guic-field-label' }, '强度'),
          React.createElement('input', {
            type: 'range',
            min: 0,
            max: 40,
            className: 'guic-range',
            value: Math.round(ambient.strength * 100),
            onChange: (ev) => updateAmbient({ strength: Number(ev.target.value) / 100 }),
          }),
          React.createElement('span', { className: 'guic-note' }, String(Math.round(ambient.strength * 100)) + '%'),
        ),
        React.createElement('div', { className: 'guic-ambient-row' },
          React.createElement('span', { className: 'guic-field-label' }, '呼吸'),
          React.createElement('input', {
            type: 'range',
            min: 0,
            max: 100,
            className: 'guic-range',
            value: Math.round((Number(ambient.breatheAmp) || 0) * 100),
            onChange: (ev) => updateAmbient({ breatheAmp: Number(ev.target.value) / 100 }),
          }),
          React.createElement('span', { className: 'guic-note' }, String(Math.round((Number(ambient.breatheAmp) || 0) * 100)) + '%'),
        ),
        React.createElement('div', { className: 'guic-ambient-row' },
          React.createElement('span', { className: 'guic-field-label' }, '位置'),
          POSITION_ORDER.map((key) => React.createElement('button', {
            key,
            className: ambient.position === key ? 'guic-preset guic-preset-active' : 'guic-preset',
            onClick: () => updateAmbient({ position: key }),
          }, POSITION_LABELS[key])),
        ),
        React.createElement('div', { className: 'guic-h' }, '背景图'),
        React.createElement('div', { className: 'guic-ambient-row' },
          React.createElement('span', { className: 'guic-field-label' }, '状态'),
          React.createElement('span', { className: 'guic-note' }, bg.enabled ? '已开启' : '未开启'),
          workspaces !== undefined
            ? React.createElement('button', { className: 'guic-btn', onClick: pickImage }, '选择图片…')
            : null,
        ),
        browseFiles.length > 0
          ? React.createElement('div', { className: 'guic-presets' },
              React.createElement('span', { className: 'guic-note' }, browseDir),
              browseFiles.map((file) => React.createElement('button', {
                key: file.path,
                className: 'guic-preset',
                onClick: () => onPickFile(file.path),
              }, file.name)),
            )
          : null,
        React.createElement('div', { className: 'guic-ambient-row' },
          React.createElement('span', { className: 'guic-field-label' }, '图片路径'),
          React.createElement('input', {
            type: 'text',
            className: 'guic-field-text',
            value: bgPath,
            onChange: (ev) => setBgPath(ev.target.value),
            placeholder: '如 assets/bg.png 或绝对路径',
          }),
        ),
        React.createElement('div', { className: 'guic-ambient-row' },
          React.createElement('button', { className: 'guic-btn guic-btn-primary', onClick: onApplyBg }, '应用背景图'),
          React.createElement('button', { className: 'guic-btn', onClick: onClearBg }, '清除背景图'),
        ),
        React.createElement('div', { className: 'guic-note' },
          '开启后对话主区大幅透出图片（底色降至 30% 不透明），卡片与侧栏轻微透图，遮罩随明暗自适应；支持 png/jpg/webp/gif，≤8MB；相对路径基于工作区。',
        ),
        React.createElement('div', { className: 'guic-notice' }, notice),
        React.createElement('div', { className: 'guic-note' },
          '提示：配色、氛围与背景图设置保存到工作区 .guic.json，刷新页面后自动恢复；选择「系统默认」会清除保存。',
        ),
      )
    }

    slots.inject('settings.section', () => slots.register(
      { name: 'settings.section', id: 'gui-customization', order: 5, label: '界面设定' },
      () => React.createElement(GuiPanel),
    ))

    slots.inject('shell.overlay', () => slots.register(
      { name: 'shell.overlay', id: 'guic-ambient', order: 0 },
      () => React.createElement(AmbientLayer),
    ))
  },
}

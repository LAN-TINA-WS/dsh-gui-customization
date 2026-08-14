# GUICustomization — 界面配色定制插件

让用户自定义 DSH 界面配色；加载即应用默认「Nous 蓝」主题，设置面板内可切换预设或逐项微调颜色。

## 功能

- **默认配色**：插件激活立即应用（明暗双模式，暗色自动用配套深色版）
- **氛围层（v3/v4）**：shell.overlay 角落光晕（颜色随主题 brand-primary 联动）+ 呼吸动画；可调：开关、强度（0–40%）、呼吸幅度（0–100%，0=静止）、位置（5 模式），全部实时生效、点击穿透
- **背景图（v5/v7）**：图片路径 → Host 读文件转 base64 → body 背景层 + 主题自适应 scrim 遮罩；开启时面板令牌自动半透明透图；**文件管理器选图（v7）**：原生目录选择器 + 目录图片列表点选；开关/路径持久化（存档只存路径，≤8MB）
- **持久化（v2）**：配色与氛围设置保存到工作区根目录 `.guic.json`（Host 半 RPC），刷新页面/重跑插件后自动恢复；「系统默认」清除存档
- **设置页**：「设置 → 界面设定」（`settings.section`，id `gui-customization`，order 5）
- **预设**：系统默认 / Nous 蓝（默认）/ 靛紫 / 翡翠绿
- **自定义**：13 个颜色字段（文本可填 hex / rgb / rgba，取色器辅助），点击「应用配色」生效
- 实现方式：`theme.overrideTokens`（覆盖层，不污染主题注册表），移除层即可还原系统默认

## 配色设计（Nous 蓝，默认）

| 界面 | 颜色 | 主题令牌 |
| --- | --- | --- |
| 背景 | #F8FAFF 近白微蓝 | --dsw-alias-bg-base |
| 文字 | #17171A 近黑 | --dsw-alias-label-primary |
| 卡片 | #FFFFFF 纯白 | --dsw-alias-bg-layer-1 |
| 主色 | #0053FD Nous蓝 | --dsw-alias-brand-primary |
| 次级面 | #F2F6FF 淡蓝 | --dsw-alias-bg-layer-2 |
| 边框 | rgba(0,83,253,0.22) | --dsw-alias-border-l1 |
| 侧边栏 | #F3F7FF 浅蓝灰 | --dsw-specific-sidebar-fill |
| 次要文字 | #71717A | --dsw-alias-label-secondary |
| 浮层背景 | #FFFFFF | --dsw-alias-bg-overlay |
| 强边框 | rgba(0,83,253,0.45) | --dsw-alias-border-l2 |
| 错误/成功/警告 | #E5484D / #2E9E5B / #D9920B | --dsw-alias-state-*-primary |

## 已知边界

- 存档文件 `.guic.json` 写在工作区根目录（`sandboxPolicy.workspaceRoot`）；迁移工作区后需随文件带走存档。
- 动态插件本体仍是进程内临时扩展：DSH 进程重启后需用本仓库源码重新 define/run 恢复插件；存档配色则始终保留。
- 可定制范围 = 产品现有 13 个主题令牌；无法新增令牌（圆角/字体等不在令牌体系内）。
- **背景图（v5 PoC 局限）**：动态插件沙箱无 `document`，背景层经 `styles.insert` 以 `body` 选择器注入（组合发布版将改为 body 属性 + 属性选择器的正规方案）；scrim 与半透明化基于当前配色的 hex 值，rgba 自定义面色不做 alpha 变换；暗色模式遮罩由主题底色自适应。

## 路线图（只做插件，不改 DSH）

### 铁律
- 交付形态：**动态插件 = 开发原型；组合插件 = 发布形态**。所有功能设计兼容两种形态。
- 不动 DSH 源码；超出插件协议边界的需求（如自定义设置页导航图标）降级或搁置。

### P1 — 持久化与转正（下一阶段核心）

| # | 功能 | 平台 | 阶段 | 说明 |
| --- | --- | --- | --- | --- |
| 1 | 组合插件转正 | Client(+Host) | 组合 | 把源码包装为组合插件挂入部署（`dsh.client` 机制），出现在「设置 → 插件」区，跨重启存在 |
| 2 | 配色持久化 | Host+Client | 组合 | Host 半用 `settings` 服务注册命名空间（JSON schema）保存/恢复配色；跨刷新、跨重启生效 |
| 3 | 过渡期持久化 | Host | 动态 | **已完成（v2）**：Host 半 RPC 读写工作区 `.guic.json`，刷新/重跑后恢复 |

### P2 — 编辑体验

| # | 功能 | 平台 | 说明 |
| --- | --- | --- | --- |
| 4 | 明暗分离编辑 | Client | light/dark 各 13 字段独立编辑（当前 dark 为自动配套深色） |
| 5 | 实时预览 | Client | 字段修改即时生效（当前需点「应用配色」） |
| 6 | 输入校验 | Client | 非法 CSS 颜色值红框提示并拒绝应用，避免传给 theme 抛错 |
| 7 | 预设扩充 + 导入/导出 | Client | 更多预设；当前配色导出为 JSON 文本复制/粘贴导入 |
| 8 | 快捷入口 | Client | 会话头部（`conversation.session.header.actions`）调色板按钮，快速切预设 |
| E1 | 氛围层 | Client | **已完成（v3/v4）**：角落光晕+呼吸动画+强度/呼吸幅度/位置调节，随主题联动（借鉴 dsh-web-ui 皮肤 scrim 手法） |
| E2 | 背景图 | Client+Host | **已完成（v5，PoC 级）**：body 背景层 + 主题自适应 scrim + 面板半透明令牌；局限见「已知边界」 |

### P3 — 打磨（无伤大雅）

| # | 功能 | 平台 | 说明 |
| --- | --- | --- | --- |
| 9 | 图标 | Client | label 内嵌 emoji（` 界面配色`）零成本方案；真图标需自绘设置外壳或改 DSH，**不做** |
| 10 | 本地化 | Client | label/文案接 `locale` 服务字典 |
| 11 | Run 卡交互区 | Client | `tool.view.cordis`（key `self`）内放迷你配色条/预设切换 |
| 12 | 主题联动 | Client | 监听 `theme/change`，系统明暗切换时同步 UI 状态提示 |

## 运行态台账

<!-- 每次 define / run / update 后在此追加一行 -->
- **v1**：define `guic-3/pkg-3`（GUICustomization v1，纯 Client）→ run `run-3`： 已激活 → 用户 stop 后手动 run-4  → 重新加载 run-5 
- **v2**：define `guic-3/pkg-4`（GUICustomization v2，Host+Client，持久化 .guic.json）→ update `run-6`： 已激活
- **v3**：define `guic-3/pkg-5`（GUICustomization v3，+氛围层、更名「界面设定」、存档扩展 ambient）→ update `run-7`： 已激活
- **v4**：define `guic-3/pkg-6`（GUICustomization v4，呼吸幅度滑块 + 光晕位置 5 模式）→ update `run-8`： 已激活
- **v5**：define `guic-3/pkg-7`（GUICustomization v5，+背景图自定义）→ update `run-9`： 已激活（反馈：主界面看不到图）
- **v6**：define `guic-3/pkg-8`（GUICustomization v6，修复背景图可见性）→ update `run-10`： 已激活（主区仍看不到图，留待组合版）
- **v7**：define `guic-3/pkg-9`（GUICustomization v7，+文件管理器选图）→ update `run-11`： 已激活
- **退役**：随 DSH 重启蒸发；功能已由发布轨组合版 `dsh-gui-customization` v0.1.0 接替（packages/dsh-gui-customization/），双轨映射 **动态 v7 ↔ 组合 v0.1.0**

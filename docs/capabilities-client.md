# Client 能力清单（UI 插件准备）

> 采集自本会话运行时的 Inspect 结果（Slots / Service / Event / Builtin / Theme）。
> 本文档是**快照**：每次开发前仍应重新查询，能力目录随运行时变化。

## 1. 槽位全景（Slot Map）

树形总览（kind：single | list | keyed | chain；scope：root | session-maybe | session）：

```
root (single, root)
├── sidebar (single, root)
│   ├── sidebar.workspaces (single, root)
│   │   └── sidebar.workspaces.directoryFlow (single)
│   ├── sidebar.settings (single, root)
│   │   ├── settings.trigger / settings.header / settings.close (single)
│   │   ├── settings.action (list)
│   │   ├── settings.section (list)                        ← 设置整页入口
│   │   │   ├── settings.general.item (list)               ← 通用偏好单行
│   │   │   └── settings.plugins.tab (list)
│   │   │       └── settings.plugin.item (list)
│   │   └── settings.onboarding (list)
│   └── sidebar.footer.action (list)                       ← 侧栏底部动作
├── conversation (single, session-maybe)
│   ├── conversation.session (single, session)
│   │   └── conversation.view (list)
│   │       └── conversation.chat.node (keyed, 键表见 §4)
│   │           ├── conversation.chat.commandview (keyed, 开放键表)
│   │           ├── conversation.chat.turnTail (chain)     ← 回合尾部扩展
│   │           ├── conversation.chat.assistant-actions (list)
│   │           └── tool.call.toolview (keyed, 按工具名)
│   │               └── tool.view.cordis (keyed, 仅 key='self')  ← Run 卡交互区
│   ├── conversation.session.header (single, session)
│   │   ├── conversation.session.header.utilities (list)
│   │   └── conversation.session.header.actions (list)     ← 会话头部按钮
│   ├── conversation.composer (chain)                      ← 输入栏接管
│   ├── conversation.composer.bar (single)
│   │   ├── conversation.input.plan (single)
│   │   └── conversation.input.model (single)
│   ├── conversation.input.overlay (list)                  ← 输入栏浮动锚点
│   ├── conversation.input.dock (list)                     ← 输入卡上方独占整行
│   ├── conversation.composer.dock (list)                  ← 输入卡下方条带
│   ├── conversation.input.left / .right (list)            ← 输入卡工具行两端
│   ├── conversation.hero.workspace (single)
│   │   └── conversation.hero.workspace.directoryFlow (single)
│   └── conversation.hero.agentPreset (single)
├── details (single, session)
│   └── conversation.details.tool (single)
└── shell.overlay (list, root)                             ← 帧级浮层
```

## 2. 注册协议（四种 kind）

| kind | 注册选项 | 语义 |
| --- | --- | --- |
| single | 无 | 单席位：占据即替换原 occupant（会遮蔽自带 UI，慎用） |
| list | `{ id*: string, order?: number, label?: string \| () => string }` | 附加列表：**新 id 追加在自带项旁边**；复用自带 id 会进入并替换该格。`label` 为 thunk 时每次投影重读，可随 locale 变化 |
| keyed | `{ key*: string }` | 按键分发：注册已占用键会替换该 occupant |
| chain | `{ select*: (owner) => unknown \| null }` | 选择器路由：升序尝试，第一个非 null 结果作为组件 `matched` prop；全空回落 owner fallback |

## 3. 标准 props（按 scope）

- root 作用域槽位：`useSessions`、`useWorkspaces`
- session 作用域槽位：另加 `useSession`、`sessionId`、`useProjection`、`useInput`、`inputActions`
- 另有各槽 owner props（§4 逐项列出）。
- 优先直接用 props，**不要**为已有数据再加 Host RPC。

## 4. 常用 additive 槽位速查

| 槽位 | 用途 | owner props | 当前占用（自带） |
| --- | --- | --- | --- |
| conversation.session.header.actions | 会话头部按钮行（order 负数保留给静态上下文） | 无（self-sufficient：用标准 session kit + 自己的 inject） | agent-preset(-10)、subagent-catalog(10)、job-list(20) |
| conversation.session.header.utilities | 标题旁右侧工具，不影响会话上下文排序 | 无 | 空 |
| settings.section | 设置整页（导航行 + 内容列；`only` 按 id 过滤） | `close: () => void` | general(0)、models(10)、plugins(15)、agent-presets(20) |
| settings.general.item | 通用设置里的一行偏好（不需要独立页面时） | （未展开，用前查询） | — |
| sidebar.footer.action | 侧栏底部 Settings 旁的动作 | （未展开，用前查询） | — |
| tool.view.cordis | cordis_run 卡内的包交互区；唯一键 `self`，Guard 自动绑定本包 pluginId+packageId，最新 Run 卡承载 UI | `pluginId`, `packageId`, `pluginRunId` | 空 |
| tool.call.toolview | 按工具名键控的 Tool 调用卡（自定义新工具时才需要） | （未展开，用前查询） | 已占用键：ask_user_question、bash、cordis_define、cordis_run、cordis_stop、cordis_undefine、edit、glob、grep、read、skill、todo_write、web_fetch、web_search、write |
| conversation.chat.turnTail | 完成回合的尾部扩展链（渲染于该回合 IconActions 之前） | `turn`, `seq`, `openFile(path)` | 1 个自带 occupant |
| conversation.chat.assistant-actions | 定稿助手消息的动作条 | （未展开，用前查询） | — |
| conversation.input.dock | 输入卡上方独占整行（队列行 / 待办条 / 目标条） | （未展开，用前查询） | — |
| conversation.composer.dock | 输入卡下方条带（环境读数，自带 stats 行在此） | （未展开，用前查询） | — |
| conversation.input.left / .right | 输入卡工具行两端的小控件 | （未展开，用前查询） | — |
| conversation.input.overlay | 输入栏浮动锚点（各条目自读 store，关闭时渲染 null） | （未展开，用前查询） | — |
| shell.overlay | 帧级浮层（badge / toast / 状态胶囊）；层本身点击穿透，条目需自行恢复 pointer-events | 无 | 空 |
| conversation.composer | 输入栏接管链（替换默认 InputBar；takeover 选举隐藏而非卸载原 bar） | （未展开，用前查询） | — |
| conversation.view | 会话视图页签（chat / trajectory…，按 `only: <active id>` 单发渲染） | （未展开，用前查询） | — |
| conversation.chat.node | 会话节点渲染器（按 ChatNodeKind 键控） | （未展开，用前查询） | 已占用键：assistant-step、command、command-input、compaction、context、manual-compaction、model-retry、steering、tool-call、turn-error、turn-max-tokens、turn-tail、unknown、user、workflow-run |
| conversation.chat.commandview | 命令行孔（按 command/run.name 键控，开放键表） | （未展开，用前查询） | 无 |

> 标「（未展开，用前查询）」= 快照采集时未展开其 ownerProps；使用前 `Slots.listSubTree` 带 root 精确查询。
> 所有 single 槽与 keyed 中已占用的键：替换风险高（replaceRisk: shadows-shipped-ui），非刻意替换勿动。

## 5. Client Services

| key | 关键方法 | 说明 |
| --- | --- | --- |
| theme | `getTheme()` / `setTheme(id)` / `register(def)` / `overrideTokens(source, tokens)` | 主题注册与偏好（详见 §7） |
| layout | `toggleSidebar()` / `openDetails()` / `closeDetails()` | 面板开关（测试假件同构面） |
| locale | `getLocale()` / `subscribe(fn)` / `setLocale(id)` / `register(ns, …)` / `bind(ns)` | 字典注册与偏好 |
| sessions | `open(id)` / `openSubagent` / `search` / `fork` / `scope(id)` / `binding(id)` | 会话服务（客户端面） |
| workspaces | `connectWorkspace` / `startSession` / `create` / `pickDirectory` / `listDirectory` / `rename` / `delete` / `archiveSession` | 工作区服务（客户端面） |
| slots | `inject(key, callback)` / `register` | 槽位注入与注册 |
| timer | `timeout` / `interval` / `throttle` / `debounce` | 一次性 / 周期定时器（需 `inject: ['timer']`） |

访问方式：可选服务 `ctx.get('theme')` + undefined 检查；硬依赖 `inject: ['theme']` + `ctx.theme`。

## 6. Client Events

| 事件 | mode | 签名 |
| --- | --- | --- |
| connection/reset | emit | `()` |
| locale/change | emit | `(snapshot: LocaleSnapshot)` |
| slots/changed | emit | `(key: string)` |
| theme/change | emit | `(snapshot: ThemeSnapshot)` |

## 7. 主题（Theme）

### 令牌（13 个，覆盖时全部需要 light+dark 成对值）

| 令牌 | 用途 |
| --- | --- |
| --dsw-alias-bg-base | 应用底色 |
| --dsw-alias-bg-layer-1 | 一级抬升面背景 |
| --dsw-alias-bg-layer-2 | 二级嵌套面背景 |
| --dsw-alias-bg-overlay | 浮层 / 弹层背景 |
| --dsw-alias-border-l1 / --dsw-alias-border-l2 | 一级 / 二级边框 |
| --dsw-alias-brand-primary | 品牌主色 |
| --dsw-alias-label-primary / --dsw-alias-label-secondary | 主 / 次文字色 |
| --dsw-alias-state-error-primary / --dsw-alias-state-success-primary / --dsw-alias-state-warn-primary | 错误 / 成功 / 警告状态色 |
| --dsw-specific-sidebar-fill | 侧栏与标题行背景 |

### 分层原则

1. 全局改色 → `theme.overrideTokens(source, { 令牌: { light: '…', dark: '…' } })`（保留 disposer；裸字符串值会抛教学错误；同 source 重调 = 整层替换并置顶；动态包建议以 packageId 作 source）。
2. 包内样式 → `styles.insert(css)`，颜色用 `var(--dsw-…)`。
3. 完整主题 → `theme.register({ id, colorScheme, alias overrides })`（重复 id 抛错；light / dark 内置，system 是偏好不可注册）。
- 禁止操作 `document.body` / `window` / 产品 DOM 硬编码选择器。

## 8. Client Builtins

| 符号 | 签名 | 说明 |
| --- | --- | --- |
| ctx | `get` / `on` / `provide` / `effect` | 受限 Cordis Context |
| React | `createElement` / `useState` / `useEffect`（已确认；其他 API 用前先验） | 无 JSX 转换的 React 运行时 |
| host | `call(method, args?) → Promise<JsonValue>` | 调本包 Host 半的私有 RPC |
| styles | `insert(css) → disposer` | 包级样式注入，随 Run 清理 |
| console | `log` / `error` | 包前缀浏览器日志 |

# 编写规范（CORE）

本文件是 CORE 项目所有动态插件代码的强制性约定。

## 1. 语言与转换

- `code.host` / `code.client` 是**纯 JavaScript 函数体**，不经过 TS / JSX / bundler 转换。
- 禁用：`import`、`require`、TypeScript 类型 / `as` / 装饰器、JSX。
- Client React 一律 `React.createElement(type, props, ...children)`。
- 不要假定 `process`、`Buffer`、`window`、`document`、`fetch`、`setTimeout` 等全局存在 —— 先查对应平台的 Builtins / Service。

## 2. 服务访问

- 可选服务：`const s = ctx.get('name')`，然后判 `undefined`。
- 硬依赖：`return { inject: ['name'], apply(ctx) { ctx.name.… } }` —— 仅在服务缺失时应让插件进入等待（Cordis 会在服务出现后重新激活）时才用。
- 未声明 inject 就访问 `ctx.name` 会被 Guard 拒绝。

## 3. 生命周期与副作用

- 一切副作用（Service / Event / Tool / 定时器 / Slot / 样式 / 主题层）必须归属当前 Fiber，stop / update / undefine 时自动清除。
- 首选 `ctx.effect(() => disposer)`、`ctx.on(...)` 或官方 API 返回的 disposer。
- 模块作用域与 `apply()` 之外不允许产生进程级 / 页面级副作用。
- 定时器是 Service `timer`（Host/Client 同构）：`inject: ['timer']` 后可用 `ctx.timeout` / `ctx.interval` / `ctx.throttle` / `ctx.debounce`。

## 4. 活数据守则

- Service 实例、Event payload、Slot props、Session / ConversationSnapshot、Tool 状态是**内部活数据**。
- 禁止：`JSON.stringify` / `structuredClone` / 递归枚举 / 整体复制 / 整体渲染。
- 只取任务需要的叶子字段，再构造最小的自有 JSON。

## 5. 平台选择

| 需求 | 平台 |
| --- | --- |
| 文件 / 命令 / 进程 / 网络 | Host（fs / shell / subprocess / web） |
| Agent / Session / Host 生命周期 | Host |
| 注册模型可调用的 Tool | Host（harness） |
| 页面主题 / 布局 / 当前页面状态 | Client |
| 会话快照 / 会话列表 / 工作区列表 | Client（槽位 props 已提供） |
| 设置页 / 侧栏 / 输入区 / 浮层 / Tool 卡 | Client（Slots） |
| Host 取数 + Client 展示 | 双半（harness.handle + host.call） |

优先选择**离数据最近**的能力：槽位 props 已有的会话快照不要再经 Host 拉一遍；只改本包样式就别覆盖全局主题；只要小入口就别替换整块产品 UI。

## 6. Host ↔ Client RPC（包私有）

- Host：`harness.handle(method, handler)`；handler 入参 / 返回值必须是 lossless JSON。
- Client：`host.call(method, args)`，返回 Promise。
- 方向固定 Client→Host；禁止把函数 / React 元素 / Service / Context 等运行时对象传过线，无数据返回 `null`。
- 这是包私有通道；不要注册公开 Remote Service 或用 `ctx.remote`。

## 7. 动态 Tool（Host）

必须经 `harness.defineTool` 产出、`harness.registerTool(ctx, tool)` 注册（属于当前 Fiber，随 Run 自动移除）：

```js
harness.registerTool(ctx, harness.defineTool({
  name: 'core_demo',
  description: '一句话描述。',
  parameters: { text: { type: 'string', required: true } },   // ParameterSchemaSpec DSL
  output: {
    schema: { type: 'string' },                               // execute 返回值的 JSON schema
    render(_args, value) { return [{ type: 'text', text: String(value) }] },
    // presentationMeta 可选
  },
  async execute(args) { return 'ok' },                        // 返回值经 JSON 往返归一
}))
```

- 注册前用 `Tool.listTools` 查重，避免与现有工具冲突。
- `execute` 拥有业务结果；`render` 只决定模型与原生 UI 看到什么。
- 工具参数与返回值必须 JSON 兼容；注册必须属于当前 Plugin Fiber。

## 8. 版本与审批

- 改代码 = 追加新 Package；**永远不覆盖旧版本**。
- 审批：单勾 = 只授权当前 Package；双勾 = 授权同插件未来版本。技术失败不撤销授权。
- 用户拒绝审批后不得自动重试。

## 9. 运行与恢复

| 当前状态 | 目标 | mode |
| --- | --- | --- |
| 无 current | 任意 Package | `run` |
| 有 current | 同一个 Package | `run` |
| 有 current | 不同 Package | `update` |
| update 失败 | nextPackageId | `update` 重试 |
| update 失败 | currentPackageId | `run` 回滚 |

- `cordis_run` 返回 `awaiting-approval` / `starting` 都**不代表成功**；本轮结束，等系统上报。
- 技术失败：`cordis_inspect_self(pluginId, packageId)` 读源码与诊断 → 修复 → 同插件追加 Package → 重试。不要另建同名插件。
- update 失败**不会**自动恢复旧 Run；需要回滚时显式 `run` current。

## 10. 常见失败速查

| 现象 | 先查 |
| --- | --- |
| service "x" is not declared | 是否未声明 `inject: ['x']` 就用了 `ctx.x` → 改 `ctx.get('x')` 或缺省处理 / 声明硬依赖 |
| cannot get property "timer" without inject | 声明 `inject: ['timer']` |
| Client 解析失败 | 是否用了 JSX / TS / import / 不存在的全局 |
| 槽位注册失败 | 是否查过活槽位树；选项、key、selector 是否满足返回的协议 |
| UI 加载但页面报错 | `cordis_inspect_self` 读 `client-render` 诊断与堆栈 |
| host.call 失败 | 方法名、当前 pluginRunId、JSON 参数、handler 内的真实服务依赖 |
| update 失败 | 保持 current/next 语义：修复 next 后 update，或 run current 回滚 |

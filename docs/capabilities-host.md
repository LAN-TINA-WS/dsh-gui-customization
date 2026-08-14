# Host 能力清单

> 采集自本会话运行时的 Inspect 结果（Service / Event / Builtin）。
> 本文档是**快照**：开发前重新查询；Inspect 结果只是契约，运行时用真实 Service / Event。

## 1. Host Services（按域分组）

### Agent / Session 核心

| key | 关键方法 | 说明 |
| --- | --- | --- |
| agentLoop | create / resume / createAgent / resume(config) | 具体 Agent 工厂与驱动器 |
| agents | currentInitiator / requireInitiator / withInitiator / get / list / create / resume / register | 活 Agent 注册表 |
| sessions | create / prepare / enter / announce / get / list / fork / flush | 内存会话仓库 |
| sessionPersistence | create / append / load / inspect / readFrom / list / listSnapshots | 持久化 append-only 会话存储 |
| sessionProjections | register / snapshot / checkpoint / restore / onChanged | 投影单元表与驱动 |
| sessionProjectionCache | cachedSnapshot / write / coldSnapshot | 持久化投影缓存 |
| sessionQuery | searchSessions / searchEvents / listSessions / readSession / readSurface / traceSession / traceEvent / readEvent / filterEvents / readTitle(Snapshot)(s) | 统一会话查询（live 优先） |
| sessionReferenceResolver | listCandidates / prepare | 跨会话消息引用准备 |
| sessionTitle | get / rename / refresh / register | 会话标题折叠与生成 |
| sessionTelemetry | emit / shutdown / sharing | 遥测后端契约 |

### 模型与提示

| key | 关键方法 | 说明 |
| --- | --- | --- |
| llm | registerAdapter / listProviders / registerConfigurableProviders / discoverModels / listModels / resolveModelInfo / resolveCallConfig / prepareCall / stream | 适配器注册表 + 流式调用（可经 `llm/stream` 瀑布拦截） |
| agentDefaultModel | currentSelection / saveSelection | 默认模型选择 |
| systemPrompt | section / context / tools / variable / suppressRuntimeContext / assemble | 每步模型前的提示装配注册表 |
| tokenMeter | measure / estimateMessage | 令牌估算 |
| toolResultPruner | measureContent / pruneContent / pruneSession | 工具结果裁剪 |

### 工具 / 技能 / 命令

| key | 关键方法 | 说明 |
| --- | --- | --- |
| tools | register / get / schemas / execute / restrict / guard / presentAs | 工具注册表与执行管线 |
| skills | registerProvider / register / list / snapshot / get | 分层技能注册表 |
| commands | register / find / execute / list | 人类命令注册表 |
| codeRuntime | run | 代码运行器（language + isolation） |
| lsp | registerProvider / query | LSP 能力缝 |
| typert | register / get / resolve / list / getPackage / toJSONSchema | 生成 schema 与包反射 |
| typertGateway | invoke | 远程依赖解析调用 |
| invariants | register | 包级不变量注册 |

### 文件 / 进程 / 网络

| key | 关键方法 | 说明 |
| --- | --- | --- |
| fs | resolve / stat / lstat / readText / streamText / readBytes / listDir / writeText / editText / contains / processPath / fileUrl | 抽象文件系统 |
| shell | resolve / run / start | bash 执行 |
| shellEnv | register / collect / list | 每次执行注入的 `DSH_*` 环境变量注册 |
| subprocess | resolveExecutable / spawn / spawnTerminal | 子进程 |
| sandbox | confine | 进程沙箱 |
| sandboxPolicy | defaultMode / workspaceRoot / resolve / overrideOf | 沙箱策略解析 |
| terminals | registerBackend / spawn / send / read / signal / kill / list | PTY 后端注册与终端会话 |
| web | registerSearchProvider / registerFetchProvider / search / fetch | 联网访问 |
| webServer | register / registerUpgrade / registerFallback / tapIndex / applyIndexTaps | 浏览器 HTTP 载体 |
| attachments | imageLimits / validateImage / saveImage / readImage | 二进制附件 |
| spillStore | saveText | 溢出存储 |
| directoryPicker | capability | 目录选择能力 |
| e2b | getSandbox / cwd / runtimeRoot | E2B 云沙箱句柄 |

### 编排 / 协作

| key | 关键方法 | 说明 |
| --- | --- | --- |
| subagents | start / startContinuable / followup / interrupt / reportFrom / listChildren / listDescendants / registerProvider / getProvider / list | 子代理注册与运行 |
| jobs | start / list / get / read / kill / wait / onJobDone / onJobsChanged | 后台作业注册表 |
| goals | get / create / edit / pause / resume / complete / block / disarm | 会话目标（由所属会话日志背书） |
| workflowEngine | start | 工作流引擎 |
| planMode | get / set | 计划模式状态 |
| approval | request / setPolicy / overrideOf | 审批服务（按会话策略） |
| userQuestions | registerProvider / ask | 用户提问 UI 供应 |
| permissionPresets | current / selectFor / resolve / optionOf / set | 权限预设 |

### 设置 / 存储

| key | 关键方法 | 说明 |
| --- | --- | --- |
| settings | register(ns, schema, opts) / get / update / replace / mutate / describe | 设置命名空间（zod schema） |
| storage | mount / form / backend | 存储枢纽 |
| storageDomain | open / get / closeAll | 已挂载 domain 设施 |
| credentials | resolve / describe / set / unset | 凭据 |
| messageFeedback | list / put / delete | 消息反馈存储 |

### 平台 / 部署

| key | 关键方法 | 说明 |
| --- | --- | --- |
| agentPresets | list / resolve / mount / read / copy / remove / recompose / serviceFor | 部署级 agent 预设注册表 |
| clientModules | graph / clientPath / rebuilt / onRebuilt / onGraphChanged | Web 插件表（`dsh.client` 扫描 + 组合 + 打包路由） |
| apiProxy | respond / downloads | 统一 API 根接口 |
| compaction | compactIfNeeded / compactNow / compactRegion | 上下文压缩 |

## 2. Host Events（按域分组）

| 事件 | mode | 要点 |
| --- | --- | --- |
| **Agent 生命周期** | | |
| agent/created | emit | `(this: Scoped<Agent>, { agent })` |
| agent/disposed | emit | `(this: Scoped<Agent>, { agent })` |
| agent/error | emit | `(this, { agent, turn, step, error })` |
| agent/status | emit | `(this, { agent, status })` idle ⇄ running |
| agent/session-start | emit | `(this, { agent, source })` |
| agent-loop/config-start-failed | emit | `({ sessionId, error })` |
| agent-preset/selected | emit | `(sessionId, agentPreset)` |
| **Agent 循环瀑布** | | |
| agent/pre-step | waterfall | 否决一步或替换进入该步的消息 |
| agent/request | waterfall | 替换冻结的调用配置 |
| agent/request-error | waterfall | 处理失败请求后的重试/关闭 |
| agent/turn-stopping | serial | 回合将关闭，模型无欠账 |
| **收件箱** | | |
| agent/inbox/claimed / inserted / discarded | emit | 消息进出活收件箱 |
| **会话** | | |
| session/created / session/disposed | emit | `(this: Scoped<Session>, session)` |
| session/event | emit | 提交后追加流（fire-and-forget） |
| session/flush | parallel | 持久化检查点，await 全部监听器 |
| **工具管道** | | |
| tools/pre-execute | waterfall | 允许 / 拒绝 / 询问 |
| tools/execute | waterfall | 分发环绕（超时 / 重试 / 指标） |
| tools/post-execute | waterfall | 接受 / 替换 / 丰富 / 阻断 |
| tools/result | emit | 冻结的最终结果 |
| tools/change | emit | 工具注册/限制变化 |
| tools/code-dispatch-log | waterfall | 替换 run_code 子分发结果 |
| **文件** | | |
| fs/write-intent / fs/edit-intent | waterfall | 下一次写入/编辑的意图决策（须调 next()） |
| fs/observed | emit | 正/负观察记录 |
| **模型** | | |
| llm/stream | waterfall | 每次流式调用的环绕（重试 / 路由） |
| llm/adapters-updated | emit | 提供方拓扑变化 |
| **审批 / 凭据 / 命令** | | |
| approval/request | waterfall | 组合 answerer 决策 |
| credentials/updated | emit | `(ref: CredentialRef)` |
| commands/change | emit | 命令注册/注销 |
| **设置 / 存储** | | |
| settings/updated | emit | `(ns, next, prev, source)` |
| settings/document-updated | emit | `(ns, revision)` |
| domain/changed | emit | domain 记录写后（持久化确认之后） |
| **目标 / 技能 / 提示** | | |
| goal/changed | emit | `(this, { agent, change })` |
| skills/change | emit | 技能提供方变化 |
| system-prompt/assemble | waterfall | 装配后的 sections/contexts/tools 再加工 |
| system-prompt/change | emit | 提示提供方变化 |
| **子代理 / 工作流** | | |
| subagent/start / subagent/end | emit | 已发布子代理起止 |
| subagent/provider-added / provider-removed | emit | 提供方注册表变化 |
| workflow/start / phase / log / agent-start / agent-end / end | emit | 工作流全生命周期 |
| **遥测** | | |
| session-telemetry/record | waterfall | 出站记录变换（须调 next()） |

> mode 语义：emit = 普通广播；waterfall = 监听器最后参数是 `next()`，不阻断下游时必须调用并返回它；serial = 顺序异步；parallel = 全部并行 await。

## 3. Host Builtins

| 符号 | 签名 | 说明 |
| --- | --- | --- |
| ctx | `get` / `on` / `provide` / `effect` | 受限 Cordis Context |
| harness | `handle(method, handler)` / `defineTool(options)` / `registerTool(ctx, tool)` | 包私有 RPC + 动态 Tool（契约见 conventions §7） |
| console | `log` / `error` | 包前缀 Host 日志 |
| btoa / atob | | UTF-8 base64 编解码 |
| TextEncoder / TextDecoder | | 标准编码器 |

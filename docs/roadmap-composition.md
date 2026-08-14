# GUICustomization 转正实施计划（动态插件 → 组合插件）

> 目标见会话 goal。本文件是工程级的施工蓝图，随进度更新。

## 背景与结论（调研自 dsh-web-ui 参考仓库 + DSH 源码）

| 问题 | 结论 |
| --- | --- |
| 组合插件挂载方式 | `dsh plugin --profile web add <npm包 | link:路径>` → 写 profile 的 cordis.patch.yml + 装依赖 → 重启 `dsh web` 生效 |
| 包声明 | package.json `"dsh": { "client": { "inject": [], "platform": "web" }, "bundle": { "patch": "./cordis.patch.yml" } }` + `exports["./client"]` |
| 构建管线 | tsdown：node 半 `lib/index.js`（空 apply stub 即可）+ 浏览器半 `lib/client.js`（`window.__ModuleLoader__.load({id, factory})` 闭包工厂，CJS） |
| 运行时外部化 | 平台模块表（react / react-dom / cordis / ui-slots / web-react / ui-primitives / schema-form）由 loader 注入 require；其余依赖内联 |
| CSS | CSS Modules 经 lightningcss 编译 + 自动注入 `<style data-plugin>`；全局样式可自行注入 style 标签 |
| 背景图可见性 | 组合版有 `document`：body 属性（`data-guic-bg`）+ 属性选择器 CSS + MutationObserver 监听明暗切换（Blue Fantasy 同款） |
| 真·文件选择 | 组合版有 `FileReader`：`<input type="file" accept="image/*">` → base64 → 直接做背景，无需路径与 Host 中转 |
| 持久化 | 组合版有完整浏览器能力：设置用 localStorage；背景图数据用 IndexedDB（绕过 5MB 上限）；跨刷新/跨重启保留 |

## 架构决策

- 包名 `@core/gui-customization`，位置 `CORE/packages/gui-customization/`
- **纯 Client 包**：node 半为空 stub（同 blue-fantasy）；不依赖 Host 服务，零 fs/路径耦合
- 主题应用沿用 `theme.overrideTokens`（alias 令牌 + 半透明化 bg-base 0.3 方案不变）
- 默认配色 = 动态版 v7 行为（Nous 蓝 + 三预设 + 13 色 + 氛围光 + 背景图）
- 动态版（`plugins/gui-customization/`，guic-3）在组合版验证通过后退役（cordis_stop），双轨台账记录映射

## 施工阶段

### 阶段 0 — 构建环境（CORE 仓库）
1. CORE 根 `package.json`（private，scripts: build）+ `pnpm-workspace.yaml`（packages/*）
2. `pnpm add -D tsdown lightningcss` + react 类型
3. 复制构建 preset：`CORE/build/tsdown.client.ts` + `CORE/build/web-platform.ts`（源自 dsh-web-ui，BSD-3-Clause，保留署名注释）

### 阶段 1 — 包骨架
- `packages/gui-customization/package.json`（dsh.client 声明 + exports + files）
- `cordis.patch.yml`（insert 行）
- `tsdown.config.ts`（clientBundle preset）
- `src/index.ts`（node 半 stub：`export function apply() {}`）
- `src/client/index.ts`（功能实现，阶段 2 填充）
- `pnpm build` → 验证 `lib/client.js` / `lib/index.js` 产出

### 阶段 2 — 功能 TS 化 + 新能力
1. 配色引擎：TOKEN_KEYS / DARK / PALETTES / BG_FACE_ALPHA 常量 → TS 模块
2. 主题应用：overrideTokens + renderTheme（背景图开启时半透明化）
3. 氛围层：shell.overlay + 光晕/呼吸/位置（v4 全套）
4. 设置页：settings.section「界面设定」（v7 全套 UI）
5. 持久化：localStorage 存设置 JSON；IndexedDB 存背景图 base64；启动恢复
6. **真·文件选择**：`<input type="file" accept="image/*">` + FileReader → base64 → IndexedDB + 应用
7. **背景图可见性**：document.body.dataset.guicBg + 全局 style 注入 `body[data-guic-bg]` 规则 + MutationObserver 明暗切换 scrim
8. 系统默认还原：清 localStorage/IndexedDB + 撤销覆盖层

### 阶段 3 — 挂载与验证
1. `dsh plugin --profile web add link:D:\Deploy\deepseekherness\Project\CORE\packages\gui-customization`
2. `dsh --profile web --dump-config` 确认挂载
3. 重启 `dsh web`（用户操作桌面脚本或授权我重启）
4. 验证清单：默认配色生效 / 设置页可见 / 氛围光 / 选文件对话框 / 背景图真正显示 / 刷新与重启后恢复 / 「设置 → 插件」区
5. 修复迭代 → 通过后：动态版 cordis_stop 退役，双轨台账记录 v7 ↔ 组合 v0.1.0 映射

## 风险与对策

| 风险 | 对策 |
| --- | --- |
| npm registry 上 @deepseek-ai rc 版本与部署版本不一致 | 纯 Client 包零产品依赖（全部经 loader/服务注入），仅构建期需要 react 类型 |
| 平台模块表与部署版本漂移 | 复制时按部署版本核对；构建期 purity gate 会拦截非法 import |
| 重启打断本会话 | 挂载与构建全部完成后，重启由用户执行/授权；会话可 resume |
| IndexedDB API 在 DSH 页面环境受限 | 组合版为完整浏览器环境；若异常降级 localStorage（≤5MB）并在 UI 提示 |

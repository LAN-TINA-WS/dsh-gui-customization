# dsh-gui-customization — 组合插件（发布轨）

GUICustomization 的正式组合插件形态（曾用名 `@core/gui-customization`，按 npm 命名规范与 dsh-web-ui 惯例改为 `dsh-gui-customization`）。对应开发轨动态版 `plugins/gui-customization/`（guic-3，v1–v7 迭代，已退役）。

## 功能

- Nous 蓝默认配色（明暗双模式）+ 三预设 + 13 色自定义
- 氛围层：角落光晕（随主题 brand-primary）+ 呼吸动画（幅度可调）+ 强度 + 位置 5 模式
- 背景图：**真·文件选择对话框**（input[type=file] + FileReader）+ body 属性正规方案（`body[data-guic-bg]`，scrim 随明暗自适应）→ 对话主区真正透图
- 持久化：设置 localStorage + 背景图 IndexedDB（跨刷新/跨重启保留，纯浏览器端）
- 设置页「界面设定」+ 插件配置区卡片（设置 → 插件）

## 构建与安装

```sh
# 构建（在包目录或仓库根）
pnpm build          # 产出 lib/index.js + lib/client.js
# 安装进 web profile
node <harness>\apps\cli\lib\bin.js plugin --profile web add link:<repo>\packages\dsh-gui-customization
# 重启 dsh web 生效
```

## 台账

- **v0.1.0（当前）**：组合包首版。功能 = 动态版 v7 等价 + 真选文件 + 背景图可见性。挂载 `@core/gui-customization`  → 重启加载 （settings.section / settings.plugin.item / shell.overlay 三槽位注册，视觉三项验证通过）→ 更名 `dsh-gui-customization`（remove 旧 + add 新 ）→ 迭代：①「系统默认」保留背景图；② 系统默认+背景图下读回产品默认令牌（body 计算值）重建半透明层；③ 背景图布局模式实验（见规划，已回退）。

## 规划（待办）

- **P1 背景图「内容区布局」重做**：首版实验（图宽放大 + 左偏移）能随侧边栏移动但**右侧未对齐**（右缘溢出被裁），已回退。正确方案：不用 body 背景，改为**独立背景层元素**——插件注入 fixed div（`left: var(--guic-bg-left); right: 0; top: 0; bottom: 0`，pointer-events none，DOM 在产品 #root 之前），图在**该元素内**做 cover——元素宽 = 内容区宽，cover 天然右对齐且随侧边栏收缩；哨兵测量方案（dock 哨兵 + rAF）可复用。
- **P2 明暗分离编辑**：light/dark 各 13 色独立编辑（当前 dark 自动配套）。
- **P3 导入/导出**：配色方案 JSON 复制粘贴；快捷入口（会话头部调色板）；emoji 图标（label ` 界面设定`）。

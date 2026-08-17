# dsh-gui-customization — DeepSeek Harness 时装工坊

中文 | [English](README.en.md)

![DS娘 · 时装工坊](docs/screenshots/dsgirl-fashion-workshop.jpg)

[![npm version](https://img.shields.io/npm/v/dsh-gui-customization)](https://www.npmjs.com/package/dsh-gui-customization)
[![npm downloads](https://img.shields.io/npm/dw/dsh-gui-customization)](https://www.npmjs.com/package/dsh-gui-customization)
[![GitHub release](https://img.shields.io/github/v/release/LAN-TINA-WS/dsh-gui-customization)](https://github.com/LAN-TINA-WS/dsh-gui-customization/releases/latest)
[![GitHub downloads](https://img.shields.io/github/downloads/LAN-TINA-WS/dsh-gui-customization/total)](https://github.com/LAN-TINA-WS/dsh-gui-customization/releases)
[![GitHub stars](https://img.shields.io/github/stars/LAN-TINA-WS/dsh-gui-customization)](https://github.com/LAN-TINA-WS/dsh-gui-customization)
[![license](https://img.shields.io/github/license/LAN-TINA-WS/dsh-gui-customization)](LICENSE)

## dsh-gui-customization

DeepSeek Harness Web UI 的**主题定制插件**：Nous 蓝默认配色（明暗双模式）、四套预设与 13 色自定义、氛围光（光晕/呼吸/位置实时可调）、动态背景（图片/视频，原生文件选择 + 内置预设「deepseek娘01」+ 背景透明度滑块 + 侧边栏透明开关）、配色导入/导出，中英双语、设置持久化、跨重启保留。配置入口：设置 → 界面设定。

> [最新 Release](https://github.com/LAN-TINA-WS/dsh-gui-customization/releases/latest) · [dsh-plugin 生态](https://github.com/topics/dsh-plugin) · [反馈](https://github.com/LAN-TINA-WS/dsh-gui-customization/issues/1)

## 成品展示

![GUICustomization — 界面设定](docs/screenshots/gui-customization.png)

| 能力 | 说明 |
| --- | --- |
| 配色 | Nous 蓝默认主题（明暗双模式）+ 系统默认/Nous 蓝/靛紫/翡翠绿四预设 + 13 色自定义 |
| 氛围光 | 角落光晕随主题主色联动；强度、呼吸幅度、位置（5 模式）实时可调 |
| 动态背景 | 图片（原生选文件 + 预设「deepseek娘01」）与视频（静音循环）双模式，互斥切换；主区透出 + 明暗自适应遮罩；背景透明度滑块 + 侧边栏透明开关；IndexedDB 持久化 |
| 导入/导出 | 配色方案一键导出 JSON（自动复制剪贴板）、粘贴导入即应用 |
| 双语 | 中 / 英文案随 DSH 语言设置即时切换 |
| 持久化 | localStorage + IndexedDB，刷新页面与重启 DSH 后完整恢复 |
| 正式形态 | 组合插件，跨重启存在，出现在「设置 → 插件」区 |

## 快速安装

**GitHub 直装（推荐，国内网络最快，免等 npm）**：

```sh
dsh plugin --profile web add github:LAN-TINA-WS/dsh-gui-customization#path:packages/dsh-gui-customization
# 重启 dsh web，打开「设置 → 界面设定」开始配置
```

**npm 安装（一条命令）**：

```sh
dsh plugin --profile web add dsh-gui-customization
```

**Release ZIP 安装**：

1. 从 [Releases](https://github.com/LAN-TINA-WS/dsh-gui-customization/releases/latest) 下载 `dsh-gui-customization-v*.zip` 并解压
2. `dsh plugin --profile web add link:<解压目录>/dsh-gui-customization-v0.5.2`
3. 重启 `dsh web`，打开「设置 → 界面设定」开始配置

**从源码构建安装**（开发者）：

```sh
pnpm install && pnpm build          # 产出 packages/dsh-gui-customization/lib/
dsh plugin --profile web add link:<仓库>/packages/dsh-gui-customization
```

## 配置指南

「设置 → 界面设定」内：

| 区块 | 内容 |
| --- | --- |
| 预设配色 | 系统默认 / Nous 蓝 / 靛紫 / 翡翠绿，一键应用 |
| 自定义颜色 | 13 个主题色字段（取色器 + 文本），点「应用配色」生效 |
| 导入/导出 | 导出配色 JSON（自动复制剪贴板）；粘贴 JSON 导入即应用 |
| 氛围光 | 开关、强度、呼吸幅度、位置（5 模式），实时生效 |
| 背景图 | 选图片文件 / 预设「deepseek娘01」/ 选视频文件（静音循环）；背景透明度滑块；侧边栏透明开关 |

## 反馈

问题、需求、配色分享：提交到 [issue #1（欢迎反馈）](https://github.com/LAN-TINA-WS/dsh-gui-customization/issues/1)。

## 贡献者

| 贡献者 | 贡献 |
| --- | --- |
| [LAN-TINA-WS](https://github.com/LAN-TINA-WS) | 项目作者与维护者 |
| [QinYun165](https://github.com/QinYun165) | 大量 BUG 反馈 |
| [FuturePioneer-3](https://github.com/FuturePioneer-3) | 深色主题背景图修复（[PR #2](https://github.com/LAN-TINA-WS/dsh-gui-customization/pull/2)） |

## License

本项目采用 [MIT License](LICENSE)。仓库内 `build/` 下的 tsdown 构建 preset 源自 [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)（BSD-3-Clause，© zhu1090093659），其许可声明保留在各文件头部。

## 开发者文档

开发工艺（编写规范、DSH 能力清单、动态插件原型 → 组合插件转正流程）见 [docs/](docs/)：

| 文档 | 内容 |
| --- | --- |
| [conventions.md](docs/conventions.md) | 插件编写规范与常见失败速查 |
| [capabilities-client.md](docs/capabilities-client.md) | DSH Client 槽位/服务/事件/主题令牌清单 |
| [capabilities-host.md](docs/capabilities-host.md) | DSH Host 服务/事件/Builtin 清单 |
| [roadmap-composition.md](docs/roadmap-composition.md) | 组合插件转正施工记录 |
| [packages/dsh-gui-customization/README.md](packages/dsh-gui-customization/README.md) | 插件包档案（功能/安装/版本台账） |

仓库结构：`packages/`（插件本体）、`plugins/`（开发轨动态原型，历史档案）、`templates/`、`build/`、`docs/`、`scripts/`。

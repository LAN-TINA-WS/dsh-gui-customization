# dsh-gui-customization — DeepSeek Harness Fashion Workshop

[中文](README.md) | English

![DS Girl · Fashion Workshop](docs/screenshots/dsgirl-fashion-workshop.jpg)

[![npm version](https://img.shields.io/npm/v/dsh-gui-customization)](https://www.npmjs.com/package/dsh-gui-customization)
[![npm downloads](https://img.shields.io/npm/dw/dsh-gui-customization)](https://www.npmjs.com/package/dsh-gui-customization)
[![GitHub release](https://img.shields.io/github/v/release/LAN-TINA-WS/dsh-gui-customization)](https://github.com/LAN-TINA-WS/dsh-gui-customization/releases/latest)
[![GitHub downloads](https://img.shields.io/github/downloads/LAN-TINA-WS/dsh-gui-customization/total)](https://github.com/LAN-TINA-WS/dsh-gui-customization/releases)
[![GitHub stars](https://img.shields.io/github/stars/LAN-TINA-WS/dsh-gui-customization)](https://github.com/LAN-TINA-WS/dsh-gui-customization)
[![license](https://img.shields.io/github/license/LAN-TINA-WS/dsh-gui-customization)](LICENSE)

## dsh-gui-customization

A **theme customization plugin** for the DeepSeek Harness Web UI: default Nous Blue palette (light/dark), four presets and 13 custom colors, ambient glow (halo/breathing/position, live), dynamic backgrounds (image/video via native file picker + built-in preset "DeepSeek Girl 01" + background opacity slider + sidebar transparency toggle), palette import/export, bilingual Chinese/English UI, persistent settings that survive restarts. Config entry: Settings → Interface Settings.

> [Latest Release](https://github.com/LAN-TINA-WS/dsh-gui-customization/releases/latest) · [dsh-plugin ecosystem](https://github.com/topics/dsh-plugin) · [Feedback](https://github.com/LAN-TINA-WS/dsh-gui-customization/issues/1)

## Featured

![GUICustomization — Interface Settings](docs/screenshots/gui-customization.png)

| Capability | Notes |
| --- | --- |
| Palette | Default Nous Blue theme (light/dark) + System default / Nous Blue / Indigo / Emerald presets + 13 custom colors |
| Ambient glow | Corner halos that follow the theme's primary color; strength, breathing depth and position (5 modes) adjustable live |
| Dynamic background | Image (native picker + preset "DeepSeek Girl 01") and video (muted loop) modes, mutually exclusive; conversation area shows through with a light/dark-adaptive scrim; opacity slider + sidebar transparency toggle; IndexedDB persistence |
| Import / export | One-click palette JSON export (clipboard copy) and paste-to-apply import |
| Bilingual | Chinese / English copy follows the DSH language setting instantly |
| Persistence | localStorage + IndexedDB; fully restored after page refresh and DSH restart |
| Production form | Composition plugin, survives restarts, listed under Settings → Plugins |

## Quick Install

**npm install (recommended, one command)**:

```sh
dsh plugin --profile web add dsh-gui-customization
# restart dsh web, then open Settings → Interface Settings to configure
```

**Release ZIP install**:

1. Download `dsh-gui-customization-v*.zip` from [Releases](https://github.com/LAN-TINA-WS/dsh-gui-customization/releases/latest) and unzip it
2. `dsh plugin --profile web add link:<unzip-dir>/dsh-gui-customization-v0.5.0`
3. Restart `dsh web`, then open Settings → Interface Settings to configure

**Build from source** (developers):

```sh
pnpm install && pnpm build          # emits packages/dsh-gui-customization/lib/
dsh plugin --profile web add link:<repo>/packages/dsh-gui-customization
```

## Configuration Guide

Inside Settings → Interface Settings:

| Section | Contents |
| --- | --- |
| Preset palettes | System default / Nous Blue / Indigo / Emerald, one-click apply |
| Custom colors | 13 theme color fields (picker + text), apply with "Apply colors" |
| Import / export | Export palette JSON (copied to clipboard); paste JSON and import to apply |
| Ambient glow | Toggle, strength, breathing depth, position (5 modes), all live |
| Background | Choose image file / preset "DeepSeek Girl 01" / choose video file (muted loop); background opacity slider; sidebar transparency toggle |

## Feedback

Bugs, feature requests, palette sharing: post to [issue #1 (Welcome Feedback)](https://github.com/LAN-TINA-WS/dsh-gui-customization/issues/1).

## License

This project is licensed under the [MIT License](LICENSE). The tsdown build preset under `build/` is vendored from [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) (BSD-3-Clause, © zhu1090093659); its notice is preserved in each file header.

## Developer Docs

Development craft (coding rules, DSH capability inventories, dynamic-prototype → composition-plugin migration) lives in [docs/](docs/):

| Document | Contents |
| --- | --- |
| [conventions.md](docs/conventions.md) | Coding rules and common-failure quick reference |
| [capabilities-client.md](docs/capabilities-client.md) | DSH client slots / services / events / theme tokens |
| [capabilities-host.md](docs/capabilities-host.md) | DSH host services / events / builtins |
| [roadmap-composition.md](docs/roadmap-composition.md) | Composition migration field notes |
| [packages/dsh-gui-customization/README.md](packages/dsh-gui-customization/README.md) | Plugin package record (features/install/ledger) |

Layout: `packages/` (the plugin), `plugins/` (dev-track dynamic prototypes, historical archive), `templates/`, `build/`, `docs/`, `scripts/`.

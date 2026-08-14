# dsh-gui-customization — DeepSeek Harness Fashion Workshop

[中文](README.md) | English

## dsh-gui-customization

A **theme customization plugin** for the DeepSeek Harness Web UI: default Nous Blue palette (light/dark), four presets and 13 custom colors, ambient glow (halo/breathing/position, live), background image (native file picker + built-in preset "DeepSeek Girl 01"), bilingual Chinese/English UI, persistent settings that survive restarts. Config entry: Settings → Interface Settings.

> [Latest Release](https://github.com/LAN-TINA-WS/dsh-gui-customization/releases/latest) ·  [dsh-plugin ecosystem](https://github.com/topics/dsh-plugin) · Install: `dsh plugin --profile web add link:<dir>` (see "Quick Start → Release track")

A plugin development project on top of [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH): ideas are iterated fast as **dynamic Cordis plugins**, and shipped stable as **composition plugins**. The first product, **GUICustomization** (Interface Settings), is live.

## Featured: GUICustomization

A theme plugin that lets users customize the DSH interface — a default "Nous Blue" palette, ambient glow, and background image, all configurable under Settings → Interface Settings, with persistent settings that survive restarts.

![GUICustomization — Interface Settings](docs/screenshots/gui-customization.png)

| Capability | Notes |
| --- | --- |
| Palette | Default Nous Blue theme (light/dark) + System default / Nous Blue / Indigo / Emerald presets + 13 custom colors |
| Ambient glow | Corner halos that follow the theme's primary color; strength, breathing depth and position (5 modes) adjustable live |
| Background image | Native file picker; conversation area shows the image with a light/dark-adaptive scrim; data kept in IndexedDB |
| Bilingual | Chinese / English copy follows the DSH language setting instantly |
| Persistence | localStorage + IndexedDB; fully restored after page refresh and DSH restart |
| Production form | Composition plugin `dsh-gui-customization`, survives restarts, listed under Settings → Plugins |

> Delivery record: [`packages/dsh-gui-customization/README.md`](packages/dsh-gui-customization/README.md) (features, build & install, ledger, roadmap).

## Two-Track Workflow (Development / Release)

| | Dev track (dynamic plugin) | Release track (composition plugin) |
| --- | --- | --- |
| Location | `plugins/<name>/` | `packages/<name>/` |
| Carrier | Plain JS function body injected by `cordis_define` | npm package: TS source + `dsh.client` declaration + tsdown bundle |
| Iteration cost | Hot-swap in seconds (define → update) | Build + deployment restart, minutes |
| Lifetime | Temporary, within the session | Permanent across restarts, listed under Settings → Plugins |
| Role | **Playground**: fast trial of new features | **Release surface**: stable delivery |

**Rules**

1. Every idea is validated on the dev track first (dynamic vN iterations); only proven versions migrate to the release track.
2. Migration = TypeScript rewrite + `dsh.client` declaration in `package.json` + build; semantics must match the current dynamic version.
3. Record the "dynamic vN ↔ composition vX" mapping in the plugin README ledger to keep the tracks from drifting.
4. Dynamic-only mechanisms (package-private RPC `harness.handle`/`host.call`) are replaced with standard composition facilities during migration.
5. Don't release every change on the release track — batch until stable to avoid frequent rebuilds.

> The full migration runbook (GUICustomization v7 → composition v0.1.0) lives in [`docs/roadmap-composition.md`](docs/roadmap-composition.md).

## Layout

```
dsh-gui-customization/
├── README.md                     # this file (Chinese)
├── README.en.md                  # this file (English)
├── docs/
│   ├── conventions.md            # coding rules: plain JS, lifecycle, live data, versioning
│   ├── capabilities-client.md    # client capability inventory: slot map, services, events, theme tokens
│   ├── capabilities-host.md      # host capability inventory: services, events, builtins
│   ├── roadmap-composition.md    # composition migration blueprint (field notes)
│   └── screenshots/              # documentation images
├── templates/                    # dynamic plugin half templates (content = code.host / code.client)
├── plugins/
│   └── gui-customization/        # dev track: dynamic v1–v7 (retired; superseded by the composition build)
├── packages/
│   └── dsh-gui-customization/    # release track: composition plugin (currently running)
├── build/                        # vendored tsdown client-bundle preset (from dsh-web-ui, BSD-3-Clause)
└── scripts/
    └── restart-dsh.ps1           # detached DSH restart script
```

## Quick Start

### Dev track: dynamic plugin loop

1. `cordis_inspect_list` → `cordis_inspect_query` to confirm the exact contracts of the Services / Events / Slots / Tokens you need.
2. Write `host.js` / `client.js` under `plugins/<name>/` (the entire file content is the `code.host` / `code.client` function body).
3. `cordis_define` (`kind:"new"` + idPrefix for new plugins; `kind:"existing"` + pluginId for updates) → `cordis_run` (`run` for first start/rollback, `update` to switch versions).
4. Pause with `cordis_stop`; delete permanently with `cordis_undefine`; diagnose failures with `cordis_inspect_self`.

### Release track: build & install a composition plugin

```sh
# Build (from the repo root)
pnpm build            # emits packages/*/lib/{index,client}.js

# Install into the web profile
node <harness>\apps\cli\lib\bin.js plugin --profile web add link:<repo>\packages\dsh-gui-customization

# Restart dsh web to take effect (desktop "启动DeepSeekHarness.bat": menu 2 to stop → run again)
```

### Verification

- `node <harness>\apps\cli\lib\bin.js --profile web --dump-config` — confirm the composition layer is mounted.
- Page "Settings → Interface Settings" and "Settings → Plugins" — confirm slots and card.

## Runtime Essentials

- **Dynamic plugins** are temporary in-process extensions: `cordis_define` writes nothing to disk, definitions do not survive a process restart; code versions are immutable (a change appends a new Package); plugins belong to the current session. Repo files are the durable source; runtime pluginId/packageId go back into each plugin's README ledger.
- **Composition plugins** are mounted into the deployment via `dsh plugin --profile web add`; the `clientModules` service scans `dsh.client` declarations into the web boot graph and loads them after a restart.
- Coding constraints: plain JS function bodies (no JSX/TS/import); UI must be registered in a queried Slot; every side effect belongs to the current Fiber; read optional services with `ctx.get('name')`, reserve `inject: ['name']` for hard dependencies. See [`docs/conventions.md`](docs/conventions.md).

## Document Index

| Document | Contents |
| --- | --- |
| [conventions.md](docs/conventions.md) | Coding rules and common-failure quick reference |
| [capabilities-client.md](docs/capabilities-client.md) | Client slot map, services, events, theme tokens |
| [capabilities-host.md](docs/capabilities-host.md) | Host services, events, builtins by domain |
| [roadmap-composition.md](docs/roadmap-composition.md) | Composition migration blueprint |
| [plugins/gui-customization/README.md](plugins/gui-customization/README.md) | Dev-track dynamic record (v1–v7 ledger, retired) |
| [packages/dsh-gui-customization/README.md](packages/dsh-gui-customization/README.md) | Release-track composition record (features/install/ledger/roadmap) |

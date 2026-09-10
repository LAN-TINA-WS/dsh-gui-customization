# Changelog

All notable changes to dsh-gui-customization are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/).

## [0.6.4] - 2026-09-10

### Fixed
- **The plugin silently did nothing on DSH 0.1.0-rc.8 and newer.** The Web client now creates every client plugin entry concurrently (`Promise.all` in `packages/client/web/src/boot.ts`, first shipped in `dsh-v0.1.0-rc.8`), so a plugin whose module declares no `inject` can reach `apply()` before `ui-theme` and the slots provider have registered their services. The opening guard `if (theme === undefined || slots === undefined) return` then swallowed the whole plugin — no styles, no theme layer, no ambient overlay, no Settings row, and no error anywhere. The client module now exports `inject = ['theme', 'slots', 'locale']`, the same convention every upstream client plugin uses (e.g. `ui-theme`), so the cordis fiber stays pending until those services exist.

### Changed
- README no longer claims a card under Settings → Plugins. `settings.plugin.item` became a keyed slot dispatched by the tab only when the Host serves a matching settings namespace (`ui-settings-plugins/src/client/tab-store.ts`), and this plugin deliberately keeps its state in the browser (localStorage + IndexedDB) with an empty Host half, so that card is not dispatched. The plugin's configuration entry remains Settings → Interface Settings and it is listed under Settings → Plugins → Plugin list.

## [0.6.3] - 2026-08-15

### Added
- Warm Sunset preset (暖阳橙): terracotta-orange palette with cream surfaces.

### Fixed
- Compatibility with newer DSH builds where `settings.plugin.item` became a keyed slot: registration now provides both `id` (list protocol) and `key` (keyed protocol), fixing "keyed slot requires options.key" load failures.

## [0.6.2] - 2026-08-15

### Changed
- Settings panel restyled to match the official General-page look: hairline dividers between sections (last divider removed), official 14px section titles.

## [0.6.1] - 2026-08-15

### Fixed
- Preset highlight now survives the settings panel remounting: opening Settings after applying Indigo/Emerald/custom colors no longer falsely highlights "Nous Blue". The active preset is hoisted to plugin scope and persisted.

## [0.6.0] - 2026-08-15

### Added
- Light/dark split editing: an independent 13-color palette for dark theme (Edit mode toggle in the custom-colors section). Presets reset the dark palette to their paired dark scheme; export/import/persistence now carry both palettes.

## [0.5.3] - 2026-08-15

### Fixed
- Dark theme: background image/video/preset now shows through (dark-side tokens were left opaque) — fix contributed by [@FuturePioneer-3](https://github.com/FuturePioneer-3), thank you!

## [0.5.2] - 2026-08-14

### Added
- Two more built-in background presets: DeepSeek Girl 02 / 03 (deepseek娘02/03)
- Preset ordering fixed to 01 → 02 → 03 (asset renaming)
- Asset pipeline JPEG optimization (bundle shrank while adding two artworks)

## [0.5.1] - 2026-08-14

### Fixed
- Large custom background images now render via Blob URL (browsers silently drop CSS data URLs above ~2 MB)
- Race guard: rapidly picking several images no longer lets a slow earlier read overwrite the latest choice
- FileReader failures now surface the actual error message in the notice

## [0.5.0] - 2026-08-14

### Added
- Custom settings-nav icon (terminal window, currentColor, graceful fallback)
- Background opacity slider (10%–90%, live)
- Sidebar transparency toggle

## [0.4.0] - 2026-08-14

### Added
- Video background (dynamic background): native file picker, muted loop underlay, Blob persistence in IndexedDB, mutually exclusive with image backgrounds

## [0.3.0] - 2026-08-14

### Added
- Palette import / export (JSON + clipboard)

### Fixed
- Release ZIP packaging (top-level folder now matches install docs)

## [0.2.0] - 2026-08-14

### Added
- Built-in preset background "DeepSeek Girl 01" (deepseek娘01) with asset embed pipeline
- Full bilingual Chinese / English UI

## [0.1.0] - 2026-08-14

### Added
- Initial composition-plugin release: Nous Blue default palette (light/dark), 4 presets, 13 custom colors, ambient glow (halo/breathing/position), background image (native file picker, scrim, IndexedDB persistence)

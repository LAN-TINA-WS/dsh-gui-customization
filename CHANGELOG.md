# Changelog

All notable changes to dsh-gui-customization are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/).

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

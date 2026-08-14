window.__ModuleLoader__.load({
	id: "dsh-gui-customization",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		//#region src/client/constants.ts
		/**
		* GUICustomization（组合版）— 常量：令牌映射、预设配色、氛围/背景默认值。
		*/
		const SOURCE = "dsh-gui-customization";
		const TOKEN_KEYS = {
			"bg-base": "--dsw-alias-bg-base",
			"label-primary": "--dsw-alias-label-primary",
			"layer-1": "--dsw-alias-bg-layer-1",
			"brand-primary": "--dsw-alias-brand-primary",
			"layer-2": "--dsw-alias-bg-layer-2",
			"border-l1": "--dsw-alias-border-l1",
			"sidebar": "--dsw-specific-sidebar-fill",
			"label-secondary": "--dsw-alias-label-secondary",
			"overlay": "--dsw-alias-bg-overlay",
			"border-l2": "--dsw-alias-border-l2",
			"error": "--dsw-alias-state-error-primary",
			"success": "--dsw-alias-state-success-primary",
			"warn": "--dsw-alias-state-warn-primary"
		};
		const DARK = {
			"bg-base": "#0B0E17",
			"label-primary": "#ECEEF5",
			"layer-1": "#131829",
			"brand-primary": "#7AA2FF",
			"layer-2": "#1B2136",
			"border-l1": "rgba(122,162,255,0.26)",
			"sidebar": "#0F1420",
			"label-secondary": "#9AA3BC",
			"overlay": "#1A2033",
			"border-l2": "rgba(122,162,255,0.48)",
			"error": "#FF8080",
			"success": "#62D68F",
			"warn": "#FFC978"
		};
		const PALETTES = {
			nous: {
				label: "Nous 蓝（默认）",
				brandDark: "#7AA2FF",
				light: {
					"bg-base": "#F8FAFF",
					"label-primary": "#17171A",
					"layer-1": "#FFFFFF",
					"brand-primary": "#0053FD",
					"layer-2": "#F2F6FF",
					"border-l1": "rgba(0,83,253,0.22)",
					"sidebar": "#F3F7FF",
					"label-secondary": "#71717A",
					"overlay": "#FFFFFF",
					"border-l2": "rgba(0,83,253,0.45)",
					"error": "#E5484D",
					"success": "#2E9E5B",
					"warn": "#D9920B"
				}
			},
			indigo: {
				label: "靛紫",
				brandDark: "#A28FF5",
				light: {
					"bg-base": "#FAF8FF",
					"label-primary": "#191620",
					"layer-1": "#FFFFFF",
					"brand-primary": "#6E56CF",
					"layer-2": "#F4F1FF",
					"border-l1": "rgba(110,86,207,0.22)",
					"sidebar": "#F5F2FF",
					"label-secondary": "#6F6A80",
					"overlay": "#FFFFFF",
					"border-l2": "rgba(110,86,207,0.45)",
					"error": "#E5484D",
					"success": "#2E9E5B",
					"warn": "#D9920B"
				}
			},
			emerald: {
				label: "翡翠绿",
				brandDark: "#4CC98F",
				light: {
					"bg-base": "#F6FDF9",
					"label-primary": "#131A17",
					"layer-1": "#FFFFFF",
					"brand-primary": "#0BA05E",
					"layer-2": "#EDFAF2",
					"border-l1": "rgba(11,160,94,0.22)",
					"sidebar": "#F0FAF4",
					"label-secondary": "#68746E",
					"overlay": "#FFFFFF",
					"border-l2": "rgba(11,160,94,0.45)",
					"error": "#E5484D",
					"success": "#0BA05E",
					"warn": "#D9920B"
				}
			}
		};
		const PRESET_ORDER = [
			"default",
			"nous",
			"indigo",
			"emerald"
		];
		const FIELDS = [
			["bg-base", "背景"],
			["label-primary", "文字"],
			["layer-1", "卡片"],
			["brand-primary", "主色"],
			["layer-2", "次级面"],
			["border-l1", "边框"],
			["sidebar", "侧边栏"],
			["label-secondary", "次要文字"],
			["overlay", "浮层背景"],
			["border-l2", "强边框"],
			["error", "错误色"],
			["success", "成功色"],
			["warn", "警告色"]
		];
		const DEFAULT_AMBIENT = {
			enabled: true,
			strength: .08,
			breathe: true,
			breatheAmp: .9,
			position: "tr-bl"
		};
		const POSITION_ORDER = [
			"tr-bl",
			"tl-br",
			"top",
			"bottom",
			"center"
		];
		const POSITION_LABELS = {
			"tr-bl": "右上·左下",
			"tl-br": "左上·右下",
			top: "顶部",
			bottom: "底部",
			center: "居中"
		};
		const BG_FACE_ALPHA = {
			"bg-base": .3,
			"layer-1": .8,
			"layer-2": .7,
			"sidebar": .8,
			"overlay": .88
		};
		//#endregion
		//#region src/client/store.ts
		/**
		* GUICustomization（组合版）— 持久化：设置走 localStorage，背景图数据走 IndexedDB。
		* 组合版为完整浏览器环境，无需 Host 中转与工作区文件。
		*/
		const SETTINGS_KEY = "guic-settings";
		const DB_NAME = "guic-store";
		const DB_VERSION = 1;
		const STORE = "kv";
		const BG_KEY = "background";
		function loadSettings() {
			try {
				const raw = localStorage.getItem(SETTINGS_KEY);
				if (raw === null) return null;
				const parsed = JSON.parse(raw);
				if (parsed === null || typeof parsed !== "object") return null;
				return parsed;
			} catch {
				return null;
			}
		}
		function saveSettings(state) {
			try {
				localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
			} catch {}
		}
		function clearSettings() {
			try {
				localStorage.removeItem(SETTINGS_KEY);
			} catch {}
		}
		function openDb() {
			return new Promise((resolve, reject) => {
				if (typeof indexedDB === "undefined") {
					reject(/* @__PURE__ */ new Error("IndexedDB 不可用"));
					return;
				}
				const req = indexedDB.open(DB_NAME, DB_VERSION);
				req.onupgradeneeded = () => {
					if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
				};
				req.onsuccess = () => resolve(req.result);
				req.onerror = () => reject(req.error);
			});
		}
		async function idbGet(key) {
			try {
				const db = await openDb();
				return await new Promise((resolve, reject) => {
					const tx = db.transaction(STORE, "readonly");
					const req = tx.objectStore(STORE).get(key);
					req.onsuccess = () => resolve(req.result ?? null);
					req.onerror = () => reject(req.error);
					tx.oncomplete = () => db.close();
				});
			} catch {
				return null;
			}
		}
		async function idbSet(key, value) {
			try {
				const db = await openDb();
				await new Promise((resolve, reject) => {
					const tx = db.transaction(STORE, "readwrite");
					tx.objectStore(STORE).put(value, key);
					tx.oncomplete = () => resolve();
					tx.onerror = () => reject(tx.error);
					tx.onabort = () => reject(tx.error);
				});
				db.close();
				return true;
			} catch {
				return false;
			}
		}
		async function idbDel(key) {
			try {
				const db = await openDb();
				await new Promise((resolve, reject) => {
					const tx = db.transaction(STORE, "readwrite");
					tx.objectStore(STORE).delete(key);
					tx.oncomplete = () => resolve();
					tx.onerror = () => reject(tx.error);
				});
				db.close();
			} catch {}
		}
		async function loadBackground() {
			const value = await idbGet(BG_KEY);
			if (value !== null && typeof value === "object") {
				const obj = value;
				if (typeof obj.mime === "string" && typeof obj.data === "string") return {
					mime: obj.mime,
					data: obj.data
				};
			}
			return null;
		}
		function saveBackground(bg) {
			idbSet(BG_KEY, bg);
		}
		function deleteBackground() {
			idbDel(BG_KEY);
		}
		//#endregion
		//#region src/client/i18n.ts
		/**
		* GUICustomization（组合版）— 双语字典（zh / en）。
		* 注册进 locale 服务的 `gui-customization` 命名空间；模板占位符 {name}。
		*/
		const DICT_ZH = {
			"nav.label": "界面设定",
			"plugin.name": "界面设定（GUICustomization）",
			"plugin.desc": "Nous 蓝默认配色、预设与自定义 13 色、氛围光（光晕/呼吸/位置）、背景图。请在「设置 → 界面设定」中配置。",
			"group.presets": "预设配色",
			"preset.default": "系统默认",
			"preset.nous": "Nous 蓝",
			"preset.indigo": "靛紫",
			"preset.emerald": "翡翠绿",
			"group.colors": "自定义颜色（应用后生效）",
			"field.bg-base": "背景",
			"field.label-primary": "文字",
			"field.layer-1": "卡片",
			"field.brand-primary": "主色",
			"field.layer-2": "次级面",
			"field.border-l1": "边框",
			"field.sidebar": "侧边栏",
			"field.label-secondary": "次要文字",
			"field.overlay": "浮层背景",
			"field.border-l2": "强边框",
			"field.error": "错误色",
			"field.success": "成功色",
			"field.warn": "警告色",
			"action.applyColors": "应用配色",
			"group.ambient": "氛围光（实时生效）",
			"ambient.on": "已开启",
			"ambient.off": "已关闭",
			"ambient.breathe": "呼吸动画",
			"ambient.strength": "强度",
			"ambient.breath": "呼吸",
			"ambient.position": "位置",
			"pos.tr-bl": "右上·左下",
			"pos.tl-br": "左上·右下",
			"pos.top": "顶部",
			"pos.bottom": "底部",
			"pos.center": "居中",
			"group.bg": "背景图",
			"bg.status": "状态",
			"bg.choose": "选择图片文件…",
			"bg.clear": "清除背景图",
			"bg.note": "开启后对话主区大幅透出图片（底色降至 30% 不透明），卡片与侧栏轻微透图，遮罩随明暗自适应；图片数据存于浏览器 IndexedDB，刷新与重启后自动恢复。",
			"notice.defaultApplied": "默认「{name}」配色已应用",
			"notice.loaded": "已加载保存的配色",
			"notice.systemDefaultKeepBg": "已还原系统默认配色（背景图保留）",
			"notice.systemDefault": "已还原系统默认",
			"notice.appliedPreset": "已应用「{name}」",
			"notice.customApplied": "已应用并保存自定义配色",
			"notice.bgApplied": "背景图已应用",
			"notice.bgCleared": "背景图已清除",
			"notice.bgReadError": "图片读取失败",
			"notice.bgReadback": "已还原系统默认配色（背景图保留；bg-base 读回: {value}）",
			"hint.persist": "提示：所有设置保存在浏览器本地，跟随本机浏览器；选择「系统默认」会清除全部保存。"
		};
		const DICT_EN = {
			"nav.label": "Interface Settings",
			"plugin.name": "Interface Settings (GUICustomization)",
			"plugin.desc": "Nous Blue default palette, presets and 13 custom colors, ambient glow (halo/breathing/position), background image. Configure under Settings → Interface Settings.",
			"group.presets": "Preset palettes",
			"preset.default": "System default",
			"preset.nous": "Nous Blue",
			"preset.indigo": "Indigo",
			"preset.emerald": "Emerald",
			"group.colors": "Custom colors (applied on confirm)",
			"field.bg-base": "Background",
			"field.label-primary": "Text",
			"field.layer-1": "Cards",
			"field.brand-primary": "Primary",
			"field.layer-2": "Secondary",
			"field.border-l1": "Border",
			"field.sidebar": "Sidebar",
			"field.label-secondary": "Secondary text",
			"field.overlay": "Overlay",
			"field.border-l2": "Strong border",
			"field.error": "Error",
			"field.success": "Success",
			"field.warn": "Warning",
			"action.applyColors": "Apply colors",
			"group.ambient": "Ambient glow (live)",
			"ambient.on": "Enabled",
			"ambient.off": "Disabled",
			"ambient.breathe": "Breathing",
			"ambient.strength": "Strength",
			"ambient.breath": "Breath",
			"ambient.position": "Position",
			"pos.tr-bl": "Top-right · bottom-left",
			"pos.tl-br": "Top-left · bottom-right",
			"pos.top": "Top",
			"pos.bottom": "Bottom",
			"pos.center": "Center",
			"group.bg": "Background image",
			"bg.status": "Status",
			"bg.choose": "Choose image file…",
			"bg.clear": "Remove background",
			"bg.note": "When enabled the conversation area shows the image (base surface drops to 30% opacity), cards and sidebar stay slightly translucent, and the scrim adapts to light/dark. Image data is kept in browser IndexedDB and restored across refreshes and restarts.",
			"notice.defaultApplied": "Default “{name}” palette applied",
			"notice.loaded": "Saved palette loaded",
			"notice.systemDefaultKeepBg": "System defaults restored (background kept)",
			"notice.systemDefault": "System defaults restored",
			"notice.appliedPreset": "Applied “{name}”",
			"notice.customApplied": "Custom palette applied and saved",
			"notice.bgApplied": "Background image applied",
			"notice.bgCleared": "Background image removed",
			"notice.bgReadError": "Failed to read image",
			"notice.bgReadback": "System defaults restored (background kept; bg-base read: {value})",
			"hint.persist": "Note: all settings are stored in this browser. Choosing “System default” clears everything saved."
		};
		//#endregion
		//#region src/client/index.ts
		/**
		* GUICustomization（组合版）— Client 入口。
		*
		* 相对动态版（plugins/gui-customization）的能力差异：
		* - 持久化：localStorage（设置）+ IndexedDB（背景图 base64），无需 Host 半与工作区文件
		* - 背景图：真·文件选择对话框（input[type=file] + FileReader）+ body 属性正规方案
		*   （body[data-guic-bg] 属性选择器，scrim 用主题变量随明暗自适应）→ 主区真正透图
		* - 插件配置区识别：注册 settings.plugin.item 卡片（设置 → 插件）
		*/
		const MAIN_CSS = `
  .guic-panel { display: flex; flex-direction: column; gap: 14px; padding: 4px 0 16px; }
  .guic-h { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-secondary); }
  .guic-presets { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .guic-preset { padding: 6px 12px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); cursor: pointer; font-size: 13px; }
  .guic-preset:hover { border-color: var(--dsw-alias-brand-primary); }
  .guic-preset-active { border-color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-bg-layer-2); }
  .guic-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
  .guic-field { display: flex; align-items: center; gap: 8px; }
  .guic-field-label { width: 60px; flex: none; font-size: 12px; color: var(--dsw-alias-label-secondary); }
  .guic-field-color { width: 34px; height: 26px; padding: 0; border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px; background: none; cursor: pointer; }
  .guic-field-text { flex: 1; min-width: 0; padding: 4px 8px; font-size: 12px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 6px; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); }
  .guic-actions { display: flex; gap: 8px; }
  .guic-btn { padding: 6px 14px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); cursor: pointer; font-size: 13px; }
  .guic-btn:hover { border-color: var(--dsw-alias-brand-primary); }
  .guic-btn-primary { background: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); color: #FFFFFF; }
  .guic-notice { font-size: 12px; color: var(--dsw-alias-brand-primary); }
  .guic-note { font-size: 12px; color: var(--dsw-alias-label-secondary); line-height: 1.6; }

  .guic-ambient { position: fixed; inset: 0; pointer-events: none; }
  .guic-ambient::before, .guic-ambient::after { content: ''; position: fixed; width: 55vmax; height: 55vmax; border-radius: 50%; filter: blur(50px); }
  .guic-ambient::before { top: -18vmax; right: -14vmax; background: radial-gradient(circle, color-mix(in srgb, var(--dsw-alias-brand-primary) calc(var(--guic-strength, 8) * 1%), transparent) 0%, transparent 70%); }
  .guic-ambient::after { bottom: -20vmax; left: -16vmax; background: radial-gradient(circle, color-mix(in srgb, var(--dsw-alias-brand-primary) calc(var(--guic-strength, 8) * 0.7%), transparent) 0%, transparent 70%); }
  .guic-ambient-breathe::before { animation: guic-breathe 8s ease-in-out infinite; }
  .guic-ambient-breathe::after { animation: guic-breathe 10s ease-in-out infinite reverse; }
  @keyframes guic-breathe { 0%, 100% { opacity: var(--guic-breathe-min, 0.6); } 50% { opacity: 1; } }
  .guic-ambient-pos-tl-br::before { top: -18vmax; right: auto; left: -14vmax; }
  .guic-ambient-pos-tl-br::after { bottom: -20vmax; left: auto; right: -16vmax; }
  .guic-ambient-pos-top::before { top: -24vmax; right: auto; left: 12vw; }
  .guic-ambient-pos-top::after { top: -24vmax; left: auto; right: 12vw; bottom: auto; }
  .guic-ambient-pos-bottom::before { bottom: -26vmax; top: auto; right: auto; left: 10vw; }
  .guic-ambient-pos-bottom::after { bottom: -26vmax; top: auto; left: auto; right: 10vw; }
  .guic-ambient-pos-center::before { top: 50%; left: 50%; right: auto; bottom: auto; transform: translate(-50%, -50%); width: 85vmax; height: 85vmax; }
  .guic-ambient-pos-center::after { display: none; }

  .guic-ambient-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .guic-check { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--dsw-alias-label-secondary); cursor: pointer; }
  .guic-range { flex: 1; min-width: 100px; accent-color: var(--dsw-alias-brand-primary); }

  .guic-plugin-card { padding: 12px 14px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; background: var(--dsw-alias-bg-layer-1); }
  .guic-plugin-name { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary); }
  .guic-plugin-desc { margin-top: 4px; font-size: 12px; color: var(--dsw-alias-label-secondary); line-height: 1.6; }
`;
		function apply(ctx) {
			const theme = ctx.get("theme");
			const slots = ctx.get("slots");
			if (theme === void 0 || slots === void 0) return;
			const locale = ctx.get("locale");
			let localeActiveLang = () => "zh";
			if (locale !== void 0) {
				locale.register("gui-customization", "zh", DICT_ZH);
				locale.register("gui-customization", "en", DICT_EN);
				const localeAny = locale;
				localeActiveLang = () => localeAny.getLocale !== void 0 ? localeAny.getLocale().active : "zh";
			}
			const t = (key, vars) => {
				const en = DICT_EN[key];
				const template = localeActiveLang() === "en" && en !== void 0 ? en : DICT_ZH[key] ?? key;
				if (vars === void 0) return template;
				return template.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
			};
			const mainTag = document.createElement("style");
			mainTag.dataset.plugin = "dsh-gui-customization";
			mainTag.dataset.pluginCss = "guic-main";
			mainTag.textContent = MAIN_CSS;
			document.head.appendChild(mainTag);
			ctx.effect(() => () => {
				mainTag.remove();
			});
			let activeLayer = null;
			let currentColors = PALETTES.nous.light;
			let currentBrandDark = PALETTES.nous.brandDark;
			let userTouched = false;
			let savedState = null;
			const syncListeners = [];
			let ambientState = { ...DEFAULT_AMBIENT };
			const ambientListeners = [];
			function setAmbient(next) {
				ambientState = {
					...ambientState,
					...next
				};
				ambientListeners.slice().forEach((fn) => fn(ambientState));
			}
			let bgEnabled = false;
			let bgTag = null;
			const bgListeners = [];
			function setBg(enabled) {
				bgEnabled = enabled;
				bgListeners.slice().forEach((fn) => fn(enabled));
			}
			ctx.effect(() => () => {
				if (bgTag !== null) {
					bgTag.remove();
					bgTag = null;
				}
				delete document.body.dataset.guicBg;
			});
			function buildTokens(light, brandDark) {
				const dark = { ...DARK };
				dark["brand-primary"] = brandDark;
				const tokens = {};
				for (const key in TOKEN_KEYS) tokens[TOKEN_KEYS[key]] = {
					light: light[key] ?? "",
					dark: dark[key] ?? ""
				};
				return tokens;
			}
			function withAlpha(value, alpha) {
				const hex = /^#([0-9a-fA-F]{6})$/.exec(String(value));
				if (hex) return `rgba(${parseInt(hex[1].slice(0, 2), 16)},${parseInt(hex[1].slice(2, 4), 16)},${parseInt(hex[1].slice(4, 6), 16)},${alpha})`;
				const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)$/.exec(String(value));
				if (rgb) return `rgba(${rgb[1]},${rgb[2]},${rgb[3]},${alpha})`;
				return value;
			}
			function translucent(colors) {
				const next = { ...colors };
				for (const key in BG_FACE_ALPHA) next[key] = withAlpha(next[key] ?? "", BG_FACE_ALPHA[key]);
				return next;
			}
			function readProductTokens() {
				const style = getComputedStyle(document.body);
				const tokens = {};
				for (const key in TOKEN_KEYS) {
					const value = style.getPropertyValue(TOKEN_KEYS[key]).trim();
					if (value !== "") tokens[key] = value;
				}
				if (tokens["bg-base"] === void 0) return { ...PALETTES.nous.light };
				return tokens;
			}
			function renderTheme() {
				const light = bgEnabled ? translucent(currentColors) : currentColors;
				activeLayer = theme.overrideTokens(SOURCE, buildTokens(light, currentBrandDark));
			}
			function applyColors(light, brandDark) {
				currentColors = light;
				currentBrandDark = brandDark;
				renderTheme();
			}
			function persist() {
				saveSettings({
					colors: currentColors,
					brandDark: currentBrandDark,
					ambient: ambientState
				});
			}
			function buildBgCss(mime, data) {
				return [
					"body[data-guic-bg] {",
					"  background-color: var(--dsw-alias-bg-layer-1) !important;",
					`  background-image: linear-gradient(color-mix(in srgb, var(--dsw-alias-bg-layer-1) 97%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-bg-layer-1) 93%, transparent) 55%, color-mix(in srgb, var(--dsw-alias-bg-layer-1) 88%, transparent) 100%), ${`url("data:${mime};base64,${data}")`};`,
					"  background-position: center;",
					"  background-size: cover;",
					"  background-attachment: fixed;",
					"  background-repeat: no-repeat;",
					"}"
				].join("\n");
			}
			function applyBackgroundData(bg) {
				if (bgTag === null) {
					bgTag = document.createElement("style");
					bgTag.dataset.plugin = "dsh-gui-customization";
					bgTag.dataset.pluginCss = "guic-bg";
					document.head.appendChild(bgTag);
				}
				bgTag.textContent = buildBgCss(bg.mime, bg.data);
				document.body.dataset.guicBg = "1";
				setBg(true);
				renderTheme();
			}
			function clearBackground() {
				if (bgTag !== null) {
					bgTag.remove();
					bgTag = null;
				}
				delete document.body.dataset.guicBg;
				setBg(false);
				deleteBackground();
				renderTheme();
			}
			applyColors(PALETTES.nous.light, PALETTES.nous.brandDark);
			const saved = loadSettings();
			if (saved !== null && saved.colors !== void 0 && typeof saved.colors === "object") {
				savedState = saved;
				applyColors(saved.colors, saved.brandDark || PALETTES.nous.brandDark);
				if (saved.ambient !== void 0 && typeof saved.ambient === "object") setAmbient({
					...DEFAULT_AMBIENT,
					...saved.ambient
				});
			}
			loadBackground().then((bg) => {
				if (bg !== null && !userTouched) applyBackgroundData(bg);
			});
			function AmbientLayer() {
				const [state, setState] = (0, react.useState)(ambientState);
				(0, react.useEffect)(() => {
					const listener = (next) => setState({ ...next });
					ambientListeners.push(listener);
					return () => {
						const i = ambientListeners.indexOf(listener);
						if (i >= 0) ambientListeners.splice(i, 1);
					};
				}, []);
				if (!state.enabled) return null;
				const cls = `guic-ambient guic-ambient-pos-${POSITION_LABELS[state.position] !== void 0 ? state.position : "tr-bl"}${state.breathe ? " guic-ambient-breathe" : ""}`;
				const strength = Math.min(100, Math.max(0, Math.round(state.strength * 100)));
				const amp = Math.min(1, Math.max(0, Number(state.breatheAmp) || 0));
				const breatheMin = Math.round((1 - amp * .45) * 100) / 100;
				return (0, react.createElement)("div", {
					className: cls,
					style: {
						"--guic-strength": String(strength),
						"--guic-breathe-min": String(breatheMin)
					}
				});
			}
			function GuiPanel() {
				const [colors, setColors] = (0, react.useState)(PALETTES.nous.light);
				const [brandDark, setBrandDark] = (0, react.useState)(PALETTES.nous.brandDark);
				const [activePreset, setActivePreset] = (0, react.useState)("nous");
				const [notice, setNotice] = (0, react.useState)(t("notice.defaultApplied", { name: t("preset.nous") }));
				const [ambient, setAmbientUi] = (0, react.useState)(ambientState);
				const [bg, setBgUi] = (0, react.useState)(bgEnabled);
				const [langTick, setLangTick] = (0, react.useState)(0);
				(0, react.useEffect)(() => {
					if (locale === void 0) return;
					return locale.subscribe(() => setLangTick((x) => x + 1));
				}, []);
				(0, react.useEffect)(() => {
					const sync = () => {
						if (savedState === null || userTouched) return;
						setColors(savedState.colors);
						setBrandDark(savedState.brandDark || PALETTES.nous.brandDark);
						setActivePreset(null);
						setNotice(t("notice.loaded"));
					};
					syncListeners.push(sync);
					sync();
					return () => {
						const i = syncListeners.indexOf(sync);
						if (i >= 0) syncListeners.splice(i, 1);
					};
				}, []);
				(0, react.useEffect)(() => {
					const listener = (next) => setAmbientUi({ ...next });
					ambientListeners.push(listener);
					return () => {
						const i = ambientListeners.indexOf(listener);
						if (i >= 0) ambientListeners.splice(i, 1);
					};
				}, []);
				(0, react.useEffect)(() => {
					const listener = (enabled) => setBgUi(enabled);
					bgListeners.push(listener);
					return () => {
						const i = bgListeners.indexOf(listener);
						if (i >= 0) bgListeners.splice(i, 1);
					};
				}, []);
				const update = (key, value) => {
					userTouched = true;
					setColors((prev) => ({
						...prev,
						[key]: value
					}));
					setActivePreset("");
				};
				const updateAmbient = (patch) => {
					userTouched = true;
					setAmbient(patch);
					persist();
				};
				const handleFile = (file) => {
					userTouched = true;
					const reader = new FileReader();
					reader.onload = () => {
						const dataUrl = String(reader.result);
						const m = /^data:([a-z0-9.+-]+\/[a-z0-9.+-]+);base64,(.*)$/.exec(dataUrl);
						if (m === null) {
							setNotice(t("notice.bgReadError"));
							return;
						}
						const bgData = {
							mime: m[1],
							data: m[2]
						};
						applyBackgroundData(bgData);
						saveBackground(bgData);
						persist();
						setNotice(t("notice.bgApplied"));
					};
					reader.onerror = () => setNotice(t("notice.bgReadError"));
					reader.readAsDataURL(file);
				};
				const choosePreset = (key) => () => {
					userTouched = true;
					setActivePreset(key);
					if (key === "default") {
						setAmbient({ ...DEFAULT_AMBIENT });
						clearSettings();
						if (activeLayer !== null) {
							activeLayer();
							activeLayer = null;
						}
						if (bgEnabled) {
							const product = readProductTokens();
							setColors(product);
							applyColors(product, currentBrandDark);
							setNotice(t("notice.bgReadback", { value: String(product["bg-base"] ?? "?") }));
						} else setNotice(t("notice.systemDefault"));
						return;
					}
					const p = PALETTES[key];
					if (p === void 0) return;
					setColors(p.light);
					setBrandDark(p.brandDark);
					applyColors(p.light, p.brandDark);
					persist();
					setNotice(t("notice.appliedPreset", { name: p.label }));
				};
				const applyCustom = () => {
					userTouched = true;
					applyColors(colors, brandDark);
					persist();
					setActivePreset("");
					setNotice(t("notice.customApplied"));
				};
				return (0, react.createElement)("div", { className: "guic-panel" }, (0, react.createElement)("div", { className: "guic-h" }, t("group.presets")), (0, react.createElement)("div", { className: "guic-presets" }, PRESET_ORDER.map((key) => (0, react.createElement)("button", {
					key,
					className: activePreset === key ? "guic-preset guic-preset-active" : "guic-preset",
					onClick: choosePreset(key)
				}, t("preset." + key)))), (0, react.createElement)("div", { className: "guic-h" }, t("group.colors")), (0, react.createElement)("div", { className: "guic-grid" }, FIELDS.map(([key, label]) => {
					const value = colors[key] ?? "";
					const hex = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#0053FD";
					return (0, react.createElement)("div", {
						className: "guic-field",
						key
					}, (0, react.createElement)("span", { className: "guic-field-label" }, t("field." + key)), (0, react.createElement)("input", {
						type: "color",
						className: "guic-field-color",
						value: hex,
						onChange: (ev) => update(key, String(ev.target.value))
					}), (0, react.createElement)("input", {
						type: "text",
						className: "guic-field-text",
						value,
						onChange: (ev) => update(key, String(ev.target.value))
					}));
				})), (0, react.createElement)("div", { className: "guic-actions" }, (0, react.createElement)("button", {
					className: "guic-btn guic-btn-primary",
					onClick: applyCustom
				}, t("action.applyColors"))), (0, react.createElement)("div", { className: "guic-h" }, t("group.ambient")), (0, react.createElement)("div", { className: "guic-ambient-row" }, (0, react.createElement)("button", {
					className: ambient.enabled ? "guic-btn guic-btn-primary" : "guic-btn",
					onClick: () => updateAmbient({ enabled: !ambient.enabled })
				}, ambient.enabled ? t("ambient.on") : t("ambient.off")), (0, react.createElement)("label", { className: "guic-check" }, (0, react.createElement)("input", {
					type: "checkbox",
					checked: ambient.breathe,
					onChange: (ev) => updateAmbient({ breathe: Boolean(ev.target.checked) })
				}), t("ambient.breathe"))), (0, react.createElement)("div", { className: "guic-ambient-row" }, (0, react.createElement)("span", { className: "guic-field-label" }, t("ambient.strength")), (0, react.createElement)("input", {
					type: "range",
					min: 0,
					max: 40,
					className: "guic-range",
					value: Math.round(ambient.strength * 100),
					onChange: (ev) => updateAmbient({ strength: Number(ev.target.value) / 100 })
				}), (0, react.createElement)("span", { className: "guic-note" }, `${Math.round(ambient.strength * 100)}%`)), (0, react.createElement)("div", { className: "guic-ambient-row" }, (0, react.createElement)("span", { className: "guic-field-label" }, t("ambient.breath")), (0, react.createElement)("input", {
					type: "range",
					min: 0,
					max: 100,
					className: "guic-range",
					value: Math.round((Number(ambient.breatheAmp) || 0) * 100),
					onChange: (ev) => updateAmbient({ breatheAmp: Number(ev.target.value) / 100 })
				}), (0, react.createElement)("span", { className: "guic-note" }, `${Math.round((Number(ambient.breatheAmp) || 0) * 100)}%`)), (0, react.createElement)("div", { className: "guic-ambient-row" }, (0, react.createElement)("span", { className: "guic-field-label" }, t("ambient.position")), POSITION_ORDER.map((key) => (0, react.createElement)("button", {
					key,
					className: ambient.position === key ? "guic-preset guic-preset-active" : "guic-preset",
					onClick: () => updateAmbient({ position: key })
				}, t("pos." + key)))), (0, react.createElement)("div", { className: "guic-h" }, t("group.bg")), (0, react.createElement)("div", { className: "guic-ambient-row" }, (0, react.createElement)("span", { className: "guic-field-label" }, t("bg.status")), (0, react.createElement)("span", { className: "guic-note" }, bg ? t("ambient.on") : t("ambient.off")), (0, react.createElement)("label", { className: "guic-btn guic-btn-primary" }, (0, react.createElement)("input", {
					type: "file",
					accept: "image/*",
					style: { display: "none" },
					onChange: (ev) => {
						const file = ev.target !== null && ev.target.files !== null && ev.target.files.length > 0 ? ev.target.files[0] : null;
						if (file !== null) handleFile(file);
					}
				}), t("bg.choose")), (0, react.createElement)("button", {
					className: "guic-btn",
					onClick: clearBackground
				}, t("bg.clear"))), (0, react.createElement)("div", { className: "guic-note" }, t("bg.note")), (0, react.createElement)("div", { className: "guic-notice" }, notice), (0, react.createElement)("div", { className: "guic-note" }, t("hint.persist")));
			}
			function PluginCard() {
				return (0, react.createElement)("div", { className: "guic-plugin-card" }, (0, react.createElement)("div", { className: "guic-plugin-name" }, t("plugin.name")), (0, react.createElement)("div", { className: "guic-plugin-desc" }, t("plugin.desc")));
			}
			slots.inject("settings.section", () => slots.register({
				name: "settings.section",
				id: "gui-customization",
				order: 5,
				label: () => t("nav.label")
			}, () => (0, react.createElement)(GuiPanel)));
			slots.inject("shell.overlay", () => slots.register({
				name: "shell.overlay",
				id: "guic-ambient",
				order: 0
			}, () => (0, react.createElement)(AmbientLayer)));
			slots.inject("settings.plugin.item", () => slots.register({
				name: "settings.plugin.item",
				id: "gui-customization",
				order: 30,
				label: () => t("nav.label")
			}, () => (0, react.createElement)(PluginCard)));
		}
		//#endregion
		exports.apply = apply;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map
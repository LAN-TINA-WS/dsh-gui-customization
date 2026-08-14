# 模板说明

- `plugin.client.js`：UI 插件 Client 半模板。**整个文件就是 `code.client` 的函数体** —— 用 read 读入后把内容原样传给 `cordis_define`，不额外包装 `function () { … }`。
- `plugin.host.js`：插件 Host 半模板。同上，是 `code.host` 的函数体。

## 使用步骤

1. 复制模板到 `plugins/<你的插件名>/`，建议改名 `host.js` / `client.js`（哪个半不写就删掉）。
2. 先查询要用的槽位 / 服务契约（`cordis_inspect_query`），再改代码 —— 模板里的槽位和示例 Tool 都只是演示。
3. `cordis_define`（新插件 `kind:"new"` + 3–6 位小写字母 idPrefix）→ `cordis_run`。
4. 把返回的 pluginId / packageId 记入插件目录的 README 台账。

## 注意

- 模板是**函数体**：文件第一行注释之后直接 `return { … }`，不要加 `function`、`export`、`import`。
- Client 半要出界面必须注册槽位；`apply()` 不能直接返回 React 元素。
- 一切副作用（handle / Tool / 槽位 / 样式）都必须挂在 `apply(ctx)` 的 Fiber 内。

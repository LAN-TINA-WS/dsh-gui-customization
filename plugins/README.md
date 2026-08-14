# plugins/ — 插件源码目录（开发轨）

> 与 `packages/<name>/`（发布轨：组合插件包）互为双轨，见项目根 README「双轨工作流」。

每个插件一个目录：

```
plugins/<plugin-name>/
├── README.md   # 插件说明 + 运行态台账（pluginId / packageId 历史 / 当前版本 / run 结果）
├── host.js     # 可选。内容 = cordis_define 的 code.host（函数体）
└── client.js   # 可选。内容 = cordis_define 的 code.client（函数体）
```

## 约定

- `host.js` / `client.js` 的**全部文件内容**就是传给 `cordis_define` 的对应 code 字符串（函数体），不额外包装 `function () { … }`。
- 每次修改代码都产生新的 packageId：改完后在 README 台账追加一行记录（packageId、改动说明、run/update 结果）。
- 版本是**运行态**的：进程重启后 pluginId / packageId 失效，README 台账保留历史即可，不要据旧 ID 做运行时假设。
- 需要更新 / 回滚时，按 `docs/conventions.md` §9 的 mode 表操作（update 切版本、run 回滚）。
- 插件彻底不用了用 `cordis_undefine`；暂时停用用 `cordis_stop`（保留版本可恢复）。

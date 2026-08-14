// ============================================================================
// CORE 插件模板 — Host 半（此文件全部内容 = cordis_define 的 code.host）
// 顶层直接 return 一个 Cordis Plugin；不假定 process / Buffer / fetch 等全局。
// RPC 与 Tool 的入参 / 返回值必须是 lossless JSON。
// ============================================================================
return {
  apply(ctx) {
    // 1) 可选服务：ctx.get 读取并处理缺失（硬依赖才用 inject: [...]）
    const fs = ctx.get('fs')
    if (fs !== undefined) {
      console.log('fs 服务已挂载')
    }

    // 2) Package 私有 RPC（Client → Host）
    harness.handle('demo', async (args) => {
      return { echo: args != null ? args.value : null }
    })

    // 3) 动态 Tool：模型下一步可调用；注册属于本 Fiber，随 Run 自动移除。
    //    注册前用 Tool.listTools 查重；契约详见 docs/conventions.md §7。
    harness.registerTool(ctx, harness.defineTool({
      name: 'core_demo',
      description: 'CORE 示例工具。',
      parameters: { text: { type: 'string', required: true } },
      output: {
        schema: { type: 'string' },
        render(_args, value) {
          return [{ type: 'text', text: String(value) }]
        },
      },
      async execute(args) {
        return 'echo: ' + String(args.text)
      },
    }))
  },
}

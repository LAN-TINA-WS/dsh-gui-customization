// ============================================================================
// GUICustomization v7 — Host 半（此文件全部内容 = cordis_define 的 code.host）
// v7 新增：list-files RPC —— 列出目录中的图片文件（配合 Client 原生目录选择器）。
// v5 新增：load-image RPC —— 读取图片文件并转 base64 返回给 Client。
// ============================================================================
return {
  apply(ctx) {
    const fs = ctx.get('fs')
    const sandboxPolicy = ctx.get('sandboxPolicy')
    if (fs === undefined || sandboxPolicy === undefined) {
      harness.handle('load', async () => null)
      harness.handle('save', async () => false)
      harness.handle('load-image', async () => ({ ok: false, error: '文件服务不可用' }))
      return
    }

    const root = sandboxPolicy.workspaceRoot
    const CONFIG_NAME = '.guic.json'

    async function resolveConfig() {
      return fs.resolve(root + '/' + CONFIG_NAME)
    }

    async function readConfig() {
      try {
        const target = await resolveConfig()
        const info = await fs.stat(target)
        if (info === undefined) return null
        const text = await fs.readText(target)
        const parsed = JSON.parse(text)
        if (parsed === null || typeof parsed !== 'object' || parsed.colors === undefined) return null
        return {
          colors: parsed.colors,
          brandDark: parsed.brandDark || null,
          ambient: (parsed.ambient !== null && parsed.ambient !== undefined && typeof parsed.ambient === 'object') ? parsed.ambient : null,
          background: (parsed.background !== null && parsed.background !== undefined && typeof parsed.background === 'object') ? parsed.background : null,
        }
      } catch (_error) {
        return null
      }
    }

    harness.handle('load', async () => readConfig())

    harness.handle('save', async (args) => {
      try {
        const target = await resolveConfig()
        if (args === null || args === undefined) {
          await fs.writeText(target, 'null')
          return true
        }
        if (typeof args !== 'object' || args.colors === undefined) return false
        const ambient = (args.ambient !== null && args.ambient !== undefined && typeof args.ambient === 'object') ? args.ambient : null
        const background = (args.background !== null && args.background !== undefined && typeof args.background === 'object') ? args.background : null
        await fs.writeText(target, JSON.stringify({ colors: args.colors, brandDark: args.brandDark || null, ambient, background }))
        return true
      } catch (_error) {
        return false
      }
    })

    harness.handle('load-image', async (args) => {
      try {
        if (args === null || typeof args !== 'object' || typeof args.path !== 'string' || args.path.trim() === '') {
          return { ok: false, error: '路径为空' }
        }
        const target = await fs.resolve(args.path, { cwd: root })
        const mimeMatch = /\.(png|jpe?g|webp|gif)$/i.exec(args.path)
        const ext = mimeMatch ? mimeMatch[1].toLowerCase() : 'png'
        const mime = 'image/' + (ext === 'jpg' ? 'jpeg' : ext)
        const bytes = await fs.readBytes(target, undefined, 8 * 1024 * 1024)
        let bin = ''
        for (let i = 0; i < bytes.length; i += 0x8000) {
          bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000))
        }
        return { ok: true, mime, data: btoa(bin) }
      } catch (error) {
        return { ok: false, error: String(error && error.message ? error.message : error) }
      }
    })

    harness.handle('list-files', async (args) => {
      try {
        if (args === null || typeof args !== 'object' || typeof args.path !== 'string' || args.path.trim() === '') {
          return { ok: false, error: '路径为空', files: [] }
        }
        const target = await fs.resolve(args.path, { cwd: root })
        const entries = await fs.listDir(target)
        const files = []
        for (const entry of entries) {
          if (entry.type !== 'file') continue
          if (!/\.(png|jpe?g|webp|gif)$/i.test(entry.name)) continue
          files.push({ name: entry.name, path: fs.processPath(entry.target), size: entry.size || 0 })
        }
        files.sort((a, b) => String(a.name).localeCompare(String(b.name)))
        return { ok: true, files }
      } catch (error) {
        return { ok: false, error: String(error && error.message ? error.message : error), files: [] }
      }
    })
  },
}

// ============================================================================
// CORE UI 插件模板 — Client 半（此文件全部内容 = cordis_define 的 code.client）
// 顶层直接 return 一个 Cordis Plugin；禁止 JSX / TS / import。
// 使用前：Slots.listSubTree 确认目标槽位的协议与 props（docs/capabilities-client.md）。
// ============================================================================
return {
  apply(ctx) {
    const slots = ctx.get('slots')
    if (slots === undefined) return

    // 1) 包级样式：styles.insert 随 Run 自动清理；颜色一律用主题变量。
    styles.insert(`
      .core-ui-card {
        padding: 10px 12px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 8px;
        background: var(--dsw-alias-bg-layer-1);
        color: var(--dsw-alias-label-primary);
      }
    `)

    // 2) 会话头部动作行（list 协议：id 必填，order/label 可选；新 id 追加在自带项旁边）
    slots.inject('conversation.session.header.actions', () => slots.register(
      { name: 'conversation.session.header.actions', id: 'core-ui-demo', order: 30, label: 'CORE' },
      (props) => React.createElement('div', { className: 'core-ui-card' },
        'Session ' + String(props.sessionId),
      ),
    ))

    // 3) 可选：本包 Host 半的私有 RPC（仅 lossless JSON）
    // host.call('demo', { value: 1 }).then((reply) => console.log(reply))
  },
}

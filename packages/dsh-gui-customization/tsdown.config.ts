/**
 * Standalone build config for the CORE dsh-gui-customization plugin.
 * Reuses the vendored dsh client-bundle preset (build/tsdown.client.ts):
 * node-half lib/ plus the browser bundle lib/client.js.
 */
import { clientBundle } from '../../build/tsdown.client.ts'

export default clientBundle('dsh-gui-customization', ['src/index.ts'])

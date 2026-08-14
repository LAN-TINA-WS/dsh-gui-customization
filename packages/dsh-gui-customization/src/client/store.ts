/**
 * GUICustomization（组合版）— 持久化：设置走 localStorage，背景图数据走 IndexedDB。
 * 组合版为完整浏览器环境，无需 Host 中转与工作区文件。
 */

const SETTINGS_KEY = 'guic-settings'
const DB_NAME = 'guic-store'
const DB_VERSION = 1
const STORE = 'kv'
const BG_KEY = 'background'

export interface BackgroundData {
  mime: string
  data: string
}

// ---- localStorage：设置（配色/氛围）----

export function loadSettings(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw === null) return null
    const parsed = JSON.parse(raw)
    if (parsed === null || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function saveSettings(state: unknown): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state))
  } catch {
    // 容量不足等异常：静默降级为会话内有效
  }
}

export function clearSettings(): void {
  try {
    localStorage.removeItem(SETTINGS_KEY)
  } catch {
    // ignore
  }
}

// ---- IndexedDB：背景图 base64（绕过 localStorage 5MB 上限）----

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB 不可用'))
      return
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function idbGet(key: string): Promise<unknown | null> {
  try {
    const db = await openDb()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(key)
      req.onsuccess = () => resolve(req.result ?? null)
      req.onerror = () => reject(req.error)
      tx.oncomplete = () => db.close()
    })
  } catch {
    return null
  }
}

export async function idbSet(key: string, value: unknown): Promise<boolean> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(value, key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
    db.close()
    return true
  } catch {
    return false
  }
}

export async function idbDel(key: string): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).delete(key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    db.close()
  } catch {
    // ignore
  }
}

export async function loadBackground(): Promise<BackgroundData | null> {
  const value = await idbGet(BG_KEY)
  if (value !== null && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (typeof obj.mime === 'string' && typeof obj.data === 'string') {
      return { mime: obj.mime, data: obj.data }
    }
  }
  return null
}

export function saveBackground(bg: BackgroundData): void {
  void idbSet(BG_KEY, bg)
}

export function deleteBackground(): void {
  void idbDel(BG_KEY)
}

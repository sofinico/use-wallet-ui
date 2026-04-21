export const NOTICES_PERSIST_KEY = '__wui_notices_ack__'

export type NoticeAckMap = Record<string, number>

const listeners = new Set<() => void>()

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function emit(): void {
  for (const listener of listeners) listener()
}

export function readAll(): NoticeAckMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(NOTICES_PERSIST_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as NoticeAckMap
    }
    return {}
  } catch {
    return {}
  }
}

function writeAll(map: NoticeAckMap): void {
  if (typeof window === 'undefined') return
  try {
    if (Object.keys(map).length === 0) {
      window.localStorage.removeItem(NOTICES_PERSIST_KEY)
    } else {
      window.localStorage.setItem(NOTICES_PERSIST_KEY, JSON.stringify(map))
    }
  } catch {
    // ignore storage failures (quota, private mode, etc.)
  }
}

export function isAcknowledged(id: string): boolean {
  const map = readAll()
  return typeof map[id] === 'number'
}

export function acknowledge(id: string): void {
  const map = readAll()
  if (typeof map[id] === 'number') return
  map[id] = Date.now()
  writeAll(map)
  emit()
}

export function reset(id: string): void {
  const map = readAll()
  if (!(id in map)) return
  delete map[id]
  writeAll(map)
  emit()
}

export function clearAll(): void {
  writeAll({})
  emit()
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === NOTICES_PERSIST_KEY || event.key === null) emit()
  })
}

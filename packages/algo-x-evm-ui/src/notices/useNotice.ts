import { useCallback, useSyncExternalStore } from 'react'

import {
  acknowledge as storageAcknowledge,
  isAcknowledged as storageIsAcknowledged,
  reset as storageReset,
  subscribe,
} from './noticeStorage'
import { useNoticeConfig, type NoticeConfig } from './NoticeProvider'

export interface UseNoticeReturn {
  config: NoticeConfig | undefined
  isAcknowledged: boolean
  acknowledge: () => void
  reset: () => void
}

function getServerSnapshot(): boolean {
  return false
}

export function useNotice(id: string): UseNoticeReturn {
  const config = useNoticeConfig(id)

  const getSnapshot = useCallback(() => storageIsAcknowledged(id), [id])
  const isAcknowledged = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const acknowledge = useCallback(() => storageAcknowledge(id), [id])
  const reset = useCallback(() => storageReset(id), [id])

  return { config, isAcknowledged, acknowledge, reset }
}

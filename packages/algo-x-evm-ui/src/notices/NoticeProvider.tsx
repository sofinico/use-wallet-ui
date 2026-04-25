import { createContext, useContext, useMemo, type ReactNode } from 'react'

export type DisclaimerNotice = { kind: 'disclaimer'; text: ReactNode }
export type InfoNotice = { kind: 'info'; title?: ReactNode; body: ReactNode }
export type FooterNotice = { kind: 'footer'; text: ReactNode }
export type NoticeConfig = DisclaimerNotice | InfoNotice | FooterNotice
export type NoticesConfig = Record<string, NoticeConfig | undefined>

interface NoticeContextValue {
  notices: NoticesConfig
}

const NoticeContext = createContext<NoticeContextValue | null>(null)

export interface NoticeProviderProps {
  notices?: NoticesConfig
  children: ReactNode
}

export function NoticeProvider({ notices, children }: NoticeProviderProps) {
  const value = useMemo<NoticeContextValue>(() => ({ notices: notices ?? {} }), [notices])
  return <NoticeContext.Provider value={value}>{children}</NoticeContext.Provider>
}

export function useNoticeConfig(id: string): NoticeConfig | undefined {
  const ctx = useContext(NoticeContext)
  return ctx?.notices[id]
}

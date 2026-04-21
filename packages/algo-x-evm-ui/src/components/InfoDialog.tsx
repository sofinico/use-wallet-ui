import { useId, type ReactNode } from 'react'

import { useNotice } from '../notices/useNotice'

export interface InfoDialogProps {
  id: string
  children: ReactNode
  className?: string
}

export function InfoDialog({ id, children, className }: InfoDialogProps) {
  const { config, isAcknowledged, acknowledge } = useNotice(id)
  const titleId = useId()

  if (!config || config.kind !== 'info' || isAcknowledged) {
    return <>{children}</>
  }

  return (
    <>
      <div hidden />
      <div
        className={
          className ??
          'flex flex-col gap-4 p-5 rounded-xl border border-[var(--wui-color-border)] bg-[var(--wui-color-bg-secondary)] text-[var(--wui-color-text)]'
        }
        role="dialog"
        aria-labelledby={config.title ? titleId : undefined}
      >
        {config.title ? (
          <h3 id={titleId} className="text-base font-semibold text-[var(--wui-color-text)]">
            {config.title}
          </h3>
        ) : null}

        <div className="text-sm leading-relaxed">{config.body}</div>

        <button
          type="button"
          onClick={acknowledge}
          className="self-end py-2 px-5 bg-[var(--wui-color-primary)] text-[var(--wui-color-primary-text)] font-medium rounded-xl hover:brightness-90 transition-all text-sm"
        >
          Continue
        </button>
      </div>
    </>
  )
}

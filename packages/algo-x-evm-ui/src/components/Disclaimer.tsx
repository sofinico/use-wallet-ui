import { useId, useState, type ReactNode } from 'react'

import { useNotice } from '../notices/useNotice'

export interface DisclaimerProps {
  id: string
  children: ReactNode
  className?: string
}

export function Disclaimer({ id, children, className }: DisclaimerProps) {
  const { config, isAcknowledged, acknowledge } = useNotice(id)
  const [checked, setChecked] = useState(false)
  const checkboxId = useId()

  if (!config || config.kind !== 'disclaimer' || isAcknowledged) {
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
        role="alertdialog"
        aria-labelledby={checkboxId}
      >
        <div className="text-sm leading-relaxed">{config.text}</div>

        <label htmlFor={checkboxId} className="flex items-start gap-2 cursor-pointer text-sm select-none">
          <input
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[var(--wui-color-primary)]"
          />
          <span>I understand the risks and wish to proceed</span>
        </label>

        <button
          type="button"
          onClick={acknowledge}
          disabled={!checked}
          className="self-end py-2 px-5 bg-[var(--wui-color-primary)] text-[var(--wui-color-primary-text)] font-medium rounded-xl hover:brightness-90 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
        >
          Accept
        </button>
      </div>
    </>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { PauseCircle, PlayCircle, Loader2 } from 'lucide-react'
import { toggleAvailability } from './actions'

export function AvailabilityToggle({ initialAvailable }: { initialAvailable: boolean }) {
  const [available, setAvailable] = useState(initialAvailable)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await toggleAvailability()
      setAvailable((prev) => !prev)
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={available ? 'Clicca per mettere in pausa il profilo' : 'Clicca per tornare disponibile'}
      className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-colors disabled:opacity-60 ${
        available
          ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-950/60'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : available ? (
        <PlayCircle className="w-4 h-4" />
      ) : (
        <PauseCircle className="w-4 h-4" />
      )}
      {available ? 'Disponibile' : 'In pausa'}
    </button>
  )
}

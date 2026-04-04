'use client'

import { useState, useTransition } from 'react'
import { Sun, Moon, Loader2 } from 'lucide-react'
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
      className={`w-full sm:w-auto flex items-center justify-center gap-2.5 text-sm font-bold px-5 py-3 rounded-xl border-2 transition-colors disabled:opacity-60 min-h-[44px] ${
        available
          ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-950/60'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : available ? (
        <Sun className="w-5 h-5 text-green-500" />
      ) : (
        <Moon className="w-5 h-5 text-slate-400" />
      )}
      {available ? 'Disponibile' : 'In pausa'}
    </button>
  )
}

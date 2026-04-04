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
      title={available ? 'Clicca per mettere in pausa' : 'Clicca per tornare disponibile'}
      className={`w-full sm:w-auto flex items-center justify-center gap-2 font-semibold text-sm px-5 py-3 rounded-xl border-2 transition-colors disabled:opacity-60 min-h-[44px] ${
        available
          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
      }`}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : available ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
      {available ? 'Disponibile' : 'In pausa'}
    </button>
  )
}

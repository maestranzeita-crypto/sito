'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { X, Send, Loader2, MessageCircle } from 'lucide-react'
import type { ChatMessage } from '@/lib/database.types'
import { sendChatMessage, fetchChatThread } from '@/app/dashboard/actions'

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
}
function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}

export default function ChatDrawer({
  myEmail,
  otherEmail,
  otherNome,
  onClose,
}: {
  myEmail: string
  otherEmail: string
  otherNome: string
  onClose: () => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [pending, startTransition] = useTransition()
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function loadMessages() {
    const msgs = await fetchChatThread(otherEmail)
    setMessages(msgs)
    setLoading(false)
  }

  useEffect(() => {
    loadMessages()
    pollRef.current = setInterval(loadMessages, 4000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherEmail])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || pending) return
    const msg = text.trim()
    setText('')
    startTransition(async () => {
      await sendChatMessage(otherEmail, msg)
      await loadMessages()
    })
  }

  // Raggruppa per giorno
  let lastDay = ''

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end pointer-events-none">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 pointer-events-auto"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="relative pointer-events-auto w-full sm:w-96 h-[85vh] sm:h-[600px] bg-white rounded-t-3xl sm:rounded-2xl sm:mr-4 shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-3xl sm:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">
              {otherNome.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm leading-tight">{otherNome}</p>
              <p className="text-xs text-slate-400">{otherEmail}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messaggi */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
              <MessageCircle className="w-10 h-10 text-slate-200" />
              <p className="text-sm">Inizia la conversazione</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMine = m.sender_email === myEmail
              const day = formatDay(m.created_at)
              const showDay = day !== lastDay
              lastDay = day
              return (
                <div key={m.id}>
                  {showDay && (
                    <div className="text-center my-3">
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{day}</span>
                    </div>
                  )}
                  <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}>
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                        isMine
                          ? 'bg-orange-500 text-white rounded-br-sm'
                          : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                      }`}
                    >
                      <p>{m.message}</p>
                      <p className={`text-[10px] mt-0.5 text-right ${isMine ? 'text-orange-200' : 'text-slate-400'}`}>
                        {formatTime(m.created_at)}
                        {isMine && m.read_at && <span className="ml-1">✓</span>}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="px-3 py-3 border-t border-slate-100 flex gap-2 items-end">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as unknown as React.FormEvent) }
            }}
            placeholder="Scrivi un messaggio..."
            rows={1}
            className="flex-1 resize-none border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent max-h-24"
          />
          <button
            type="submit"
            disabled={!text.trim() || pending}
            className="flex-shrink-0 w-9 h-9 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminNav from './AdminNav'

const ADMIN_EMAIL = 'info@maestranze.com'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNav email={user.email!} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

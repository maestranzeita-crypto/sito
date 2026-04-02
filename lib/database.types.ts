// Generato manualmente dallo schema supabase/migrations/001_initial_schema.sql
// Per rigenerare automaticamente: npx supabase gen types typescript --local > lib/database.types.ts

export type LeadStatus = 'pending' | 'contacted' | 'closed'
export type ProfessionalStatus = 'pending' | 'active' | 'suspended' | 'rejected'
export type ListingStatus = 'pending' | 'active' | 'closed' | 'expired'
export type UrgenzaType = 'urgente' | 'settimana' | 'mese' | 'nessuna'
export type ContrattoType = 'Dipendente' | 'Subappalto' | 'Progetto'

export type Database = {
  public: {
    Tables: {

      lead_requests: {
        Row: {
          id: string
          created_at: string
          categoria: string
          citta: string
          descrizione: string
          urgenza: UrgenzaType
          nome: string
          telefono: string
          email: string
          status: LeadStatus
          notes: string | null
          contacted_at: string | null
          unlocked: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          categoria: string
          citta: string
          descrizione: string
          urgenza?: UrgenzaType
          nome: string
          telefono: string
          email: string
          status?: LeadStatus
          notes?: string | null
          contacted_at?: string | null
          unlocked?: boolean
        }
        Update: Partial<Database['public']['Tables']['lead_requests']['Insert']>
        Relationships: []
      }

      professionals: {
        Row: {
          id: string
          created_at: string
          categorie: string[]
          citta: string
          raggio_km: string
          ragione_sociale: string
          piva: string
          forma_giuridica: string
          telefono: string
          email: string
          anni_esperienza: string
          bio: string
          foto_url: string | null
          status: ProfessionalStatus
          is_top_rated: boolean
          rating_avg: number | null
          review_count: number
          verified_at: string | null
          telegram_username: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          categorie: string[]
          citta: string
          raggio_km?: string
          ragione_sociale: string
          piva: string
          forma_giuridica: string
          telefono: string
          email: string
          anni_esperienza: string
          bio: string
          foto_url?: string | null
          status?: ProfessionalStatus
          is_top_rated?: boolean
          rating_avg?: number | null
          review_count?: number
          verified_at?: string | null
          telegram_username?: string | null
        }
        Update: Partial<Database['public']['Tables']['professionals']['Insert']>
        Relationships: []
      }

      job_listings: {
        Row: {
          id: string
          created_at: string
          categoria: string
          tipo_contratto: ContrattoType
          titolo: string
          citta: string
          raggio: string
          descrizione: string
          requisiti: string | null
          retribuzione: string | null
          ragione_sociale: string
          telefono: string
          email: string
          status: ListingStatus
          expires_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          categoria: string
          tipo_contratto: ContrattoType
          titolo: string
          citta: string
          raggio?: string
          descrizione: string
          requisiti?: string | null
          retribuzione?: string | null
          ragione_sociale: string
          telefono: string
          email: string
          status?: ListingStatus
          expires_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['job_listings']['Insert']>
        Relationships: []
      }

      job_applications: {
        Row: {
          id: string
          created_at: string
          job_listing_id: string
          nome: string
          telefono: string
          email: string
          messaggio: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          job_listing_id: string
          nome: string
          telefono: string
          email: string
          messaggio?: string | null
          viewed_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['job_applications']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'job_applications_job_listing_id_fkey'
            columns: ['job_listing_id']
            isOneToOne: false
            referencedRelation: 'job_listings'
            referencedColumns: ['id']
          }
        ]
      }

      reviews: {
        Row: {
          id: string
          created_at: string
          professional_id: string
          lead_request_id: string | null
          rating: number
          testo: string
          nome_cliente: string
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          professional_id: string
          lead_request_id?: string | null
          rating: number
          testo: string
          nome_cliente: string
          verified?: boolean
          verified_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'reviews_professional_id_fkey'
            columns: ['professional_id']
            isOneToOne: false
            referencedRelation: 'professionals'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
    Functions: {
      expire_job_listings: {
        Args: Record<never, never>
        Returns: void
      }
    }
  }
}

// Shorthand types per le Row (utili nei componenti)
export type LeadRequest = Database['public']['Tables']['lead_requests']['Row']
export type Professional = Database['public']['Tables']['professionals']['Row']
export type JobListing = Database['public']['Tables']['job_listings']['Row']
export type JobApplication = Database['public']['Tables']['job_applications']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']

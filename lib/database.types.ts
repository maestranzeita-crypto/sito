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
          assigned_professional_id: string | null
          job_details: Record<string, string> | null
          request_type: string
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
          assigned_professional_id?: string | null
          job_details?: Record<string, string> | null
          request_type?: string
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
          foto_lavori: string[]
          status: ProfessionalStatus
          is_top_rated: boolean
          rating_avg: number | null
          review_count: number
          verified_at: string | null
          telegram_username: string | null
          gmb_link: string | null
          certificazioni: string[]
          plan_type: string
          plan_expires_at: string | null
          available: boolean
          reputation_points: number
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
          foto_lavori?: string[]
          status?: ProfessionalStatus
          is_top_rated?: boolean
          rating_avg?: number | null
          review_count?: number
          verified_at?: string | null
          telegram_username?: string | null
          gmb_link?: string | null
          certificazioni?: string[]
          plan_type?: string
          plan_expires_at?: string | null
          available?: boolean
          reputation_points?: number
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
          risposta_professionista: string | null
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
          risposta_professionista?: string | null
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

      profile_views: {
        Row: {
          id: string
          professional_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          professional_id: string
          viewed_at?: string
        }
        Update: Partial<Database['public']['Tables']['profile_views']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'profile_views_professional_id_fkey'
            columns: ['professional_id']
            isOneToOne: false
            referencedRelation: 'professionals'
            referencedColumns: ['id']
          }
        ]
      }

      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string
          category: string
          tags: string[]
          published_at: string
          reading_time: number
          author_name: string
          sections: unknown
          image_url: string | null
          image_alt: string | null
          status: string
          seo_title: string | null
          seo_description: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt: string
          category?: string
          tags?: string[]
          published_at?: string
          reading_time?: number
          author_name?: string
          sections?: unknown
          image_url?: string | null
          image_alt?: string | null
          status?: string
          seo_title?: string | null
          seo_description?: string | null
        }
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>
        Relationships: []
      }

      manodopera_requests: {
        Row: {
          id: string
          created_at: string
          nome: string
          email: string
          telefono: string
          specializzazione: string
          zona_cantiere: string
          periodo_da: string
          periodo_a: string
          tipo_ingaggio: string
          compenso: string
          requisiti: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          nome: string
          email: string
          telefono: string
          specializzazione: string
          zona_cantiere: string
          periodo_da: string
          periodo_a: string
          tipo_ingaggio: string
          compenso: string
          requisiti?: string[]
        }
        Update: Partial<Database['public']['Tables']['manodopera_requests']['Insert']>
        Relationships: []
      }

      manodopera_availability: {
        Row: {
          id: string
          created_at: string
          nome: string
          email: string
          telefono: string
          specializzazione: string
          zona_operativa: string
          disponibile_da: string
          disponibile_a: string
          tipo_collaborazione: string[]
          tariffa: string
          attrezzatura_propria: boolean
          durc_valido: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          nome: string
          email: string
          telefono: string
          specializzazione: string
          zona_operativa: string
          disponibile_da: string
          disponibile_a: string
          tipo_collaborazione?: string[]
          tariffa: string
          attrezzatura_propria?: boolean
          durc_valido?: boolean
        }
        Update: Partial<Database['public']['Tables']['manodopera_availability']['Insert']>
        Relationships: []
      }

      waitlist: {
        Row: {
          id: string
          professional_id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          professional_id: string
          email: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['waitlist']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'waitlist_professional_id_fkey'
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
export type ProfileView = Database['public']['Tables']['profile_views']['Row']
export type Waitlist = Database['public']['Tables']['waitlist']['Row']
export type BlogPostRow = Database['public']['Tables']['blog_posts']['Row']
export type ManodoperaRequest = Database['public']['Tables']['manodopera_requests']['Row']
export type ManodoperaAvailability = Database['public']['Tables']['manodopera_availability']['Row']

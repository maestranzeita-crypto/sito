import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Termini di Servizio — Maestranze',
  description: 'Termini e condizioni di utilizzo del marketplace Maestranze.com per clienti e professionisti.',
  alternates: { canonical: `${SITE_URL}/termini` },
  robots: { index: true, follow: false },
}

export default function TerminiPage() {
  return (
    <>
      <section className="relative bg-slate-900 text-white py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Termini di Servizio</h1>
          <p className="text-slate-400 text-sm">Ultimo aggiornamento: 30 marzo 2025</p>
        </div>
      </section>

    <div className="max-w-3xl mx-auto px-4 py-14">
      <div className="prose prose-slate prose-sm sm:prose-base max-w-none
        prose-headings:text-slate-900 prose-headings:font-bold
        prose-h2:text-lg prose-h2:border-l-4 prose-h2:border-orange-500 prose-h2:pl-3 prose-h2:mt-10
        prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline">

        <h2>1. Accettazione dei termini</h2>
        <p>
          L&apos;accesso e l&apos;utilizzo della piattaforma <strong>Maestranze.com</strong> (di seguito &quot;Piattaforma&quot; o &quot;Maestranze&quot;) comportano l&apos;accettazione integrale dei presenti Termini di Servizio. Se non si accettano le condizioni qui descritte, si prega di non utilizzare la Piattaforma.
        </p>
        <p>
          Maestranze si riserva il diritto di modificare i presenti termini in qualsiasi momento. Le modifiche saranno comunicate tramite email o avviso in piattaforma. L&apos;utilizzo continuato del servizio costituisce accettazione delle condizioni aggiornate.
        </p>

        <h2>2. Descrizione del servizio</h2>
        <p>
          Maestranze è un marketplace digitale che facilita l&apos;incontro tra:
        </p>
        <ul>
          <li><strong>Clienti</strong> (privati o aziende) che necessitano di servizi edili, impiantistici o affini;</li>
          <li><strong>Professionisti</strong> (imprese, artigiani, lavoratori autonomi) che offrono tali servizi.</li>
        </ul>
        <p>
          Maestranze agisce esclusivamente da intermediario tecnologico. Non è parte dei contratti di lavoro stipulati tra clienti e professionisti, non garantisce la qualità delle prestazioni erogate dai professionisti e non è responsabile del pagamento di corrispettivi tra le parti.
        </p>

        <h2>3. Requisiti di accesso</h2>
        <p>Per utilizzare la Piattaforma è necessario:</p>
        <ul>
          <li>aver compiuto 18 anni di età;</li>
          <li>avere capacità giuridica di agire;</li>
          <li>fornire informazioni veritiere, accurate e aggiornate durante la registrazione;</li>
          <li>per i professionisti: essere titolari di Partita IVA valida e possedere le abilitazioni di legge richieste per i servizi offerti.</li>
        </ul>

        <h2>4. Registrazione e account</h2>
        <p>
          La registrazione alla Piattaforma è gratuita. L&apos;utente è responsabile della riservatezza delle credenziali di accesso e di tutte le attività svolte tramite il proprio account. In caso di accesso non autorizzato, deve notificarlo immediatamente a <a href="mailto:supporto@maestranze.com">supporto@maestranze.com</a>.
        </p>
        <p>
          Maestranze si riserva il diritto di sospendere o cancellare account che violino i presenti Termini, forniscano informazioni false o tengano comportamenti scorretti nei confronti di altri utenti.
        </p>

        <h2>5. Obblighi del professionista</h2>
        <p>Il professionista che si registra su Maestranze si impegna a:</p>
        <ul>
          <li>fornire informazioni veritiere sul proprio profilo (specializzazioni, zona operativa, certificazioni);</li>
          <li>possedere e mantenere valide le abilitazioni di legge necessarie per i servizi offerti (es. abilitazione DM 37/08 per impianti elettrici e idraulici, patentino gas);</li>
          <li>essere in possesso di assicurazione RC professionale;</li>
          <li>rispondere alle richieste di preventivo in modo professionale e cortese;</li>
          <li>non contattare i clienti per finalità diverse da quelle strettamente legate alla richiesta ricevuta;</li>
          <li>non richiedere pagamenti in nero o accordi che aggirino la normativa fiscale.</li>
        </ul>

        <h2>6. Obblighi del cliente</h2>
        <p>Il cliente che utilizza Maestranze si impegna a:</p>
        <ul>
          <li>fornire informazioni accurate nelle richieste di preventivo;</li>
          <li>non contattare i professionisti per finalità diverse dal lavoro richiesto;</li>
          <li>trattare i professionisti con rispetto;</li>
          <li>lasciare recensioni veritiere e basate sulla propria esperienza diretta.</li>
        </ul>

        <h2>7. Contenuti vietati</h2>
        <p>È vietato pubblicare sulla Piattaforma contenuti che:</p>
        <ul>
          <li>siano falsi, ingannevoli o fraudolenti;</li>
          <li>contengano informazioni di contatto (telefono, email, siti web) nei campi descrittivi del profilo al fine di eludere la piattaforma;</li>
          <li>siano diffamatori, offensivi, discriminatori o violino i diritti di terzi;</li>
          <li>violino la normativa vigente in materia di pubblicità, concorrenza sleale o protezione dei consumatori;</li>
          <li>contengano virus, malware o codice dannoso.</li>
        </ul>

        <h2>8. Recensioni e reputazione</h2>
        <p>
          Le recensioni sono riservate ai clienti che hanno effettuato una richiesta di preventivo tramite Maestranze. Maestranze si riserva il diritto di rimuovere recensioni che violino le presenti condizioni o che siano palesemente false, previa verifica. I professionisti possono segnalare recensioni ritenute improprie a <a href="mailto:segnalazioni@maestranze.com">segnalazioni@maestranze.com</a>.
        </p>

        <h2>9. Responsabilità e limitazioni</h2>
        <p>
          <strong>Maestranze non è responsabile</strong> per:
        </p>
        <ul>
          <li>la qualità, la sicurezza o la conformità dei lavori eseguiti dai professionisti;</li>
          <li>le obbligazioni contrattuali tra clienti e professionisti;</li>
          <li>danni diretti o indiretti derivanti dall&apos;uso o dall&apos;impossibilità di utilizzo della Piattaforma;</li>
          <li>la veridicità delle informazioni inserite dagli utenti;</li>
          <li>interruzioni del servizio dovute a manutenzione, guasti o cause di forza maggiore.</li>
        </ul>
        <p>
          La responsabilità di Maestranze, nei limiti consentiti dalla legge, è in ogni caso limitata all&apos;importo degli eventuali corrispettivi pagati dall&apos;utente per piani a pagamento negli ultimi 12 mesi.
        </p>

        <h2>10. Proprietà intellettuale</h2>
        <p>
          Tutti i contenuti della Piattaforma (logo, testi, grafica, codice sorgente) sono di proprietà di Maestranze o dei rispettivi titolari e sono protetti dalla normativa sul diritto d&apos;autore. È vietata la riproduzione, distribuzione o utilizzo commerciale senza autorizzazione scritta.
        </p>
        <p>
          L&apos;utente, pubblicando contenuti sulla Piattaforma (descrizioni, foto, recensioni), concede a Maestranze una licenza non esclusiva, gratuita e mondiale per utilizzare tali contenuti ai fini dell&apos;erogazione e promozione del servizio.
        </p>

        <h2>11. Servizio gratuito e piani premium</h2>
        <p>
          La registrazione e l&apos;utilizzo base della Piattaforma sono attualmente gratuiti. Maestranze si riserva il diritto di introdurre piani a pagamento con funzionalità aggiuntive, dandone adeguato preavviso agli utenti registrati. Le funzionalità gratuite attualmente attive non saranno rese a pagamento senza un preavviso di almeno 30 giorni.
        </p>

        <h2>12. Recesso e cancellazione</h2>
        <p>
          L&apos;utente può cancellare il proprio account in qualsiasi momento scrivendo a <a href="mailto:supporto@maestranze.com">supporto@maestranze.com</a>. La cancellazione comporta la rimozione del profilo dalla Piattaforma. I dati saranno conservati nei termini previsti dalla Privacy Policy e dagli obblighi di legge.
        </p>
        <p>
          Maestranze può recedere dal contratto con l&apos;utente in caso di violazione dei presenti Termini, con effetto immediato e senza obbligo di rimborso di eventuali crediti non utilizzati.
        </p>

        <h2>13. Legge applicabile e foro competente</h2>
        <p>
          I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia derivante dall&apos;utilizzo della Piattaforma, le parti concordano la competenza esclusiva del Foro di Milano, salvo diversa disposizione inderogabile di legge a tutela del consumatore.
        </p>
        <p>
          Per la risoluzione alternativa delle controversie (ADR/ODR), i consumatori possono accedere alla piattaforma europea: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.
        </p>

        <h2>14. Contatti</h2>
        <p>
          Per qualsiasi domanda relativa ai presenti Termini:<br />
          <a href="mailto:supporto@maestranze.com">supporto@maestranze.com</a>
        </p>

      </div>
    </div>
    </>
  )
}

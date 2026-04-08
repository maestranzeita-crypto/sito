import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Privacy Policy — Maestranze',
  description: 'Informativa sul trattamento dei dati personali di Maestranze.com ai sensi del GDPR (Regolamento UE 2016/679).',
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: false },
}

export default function PrivacyPage() {
  return (
    <>
      <section className="relative bg-slate-900 text-white py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Ultimo aggiornamento: 30 marzo 2025</p>
        </div>
      </section>

    <div className="max-w-3xl mx-auto px-4 py-14">
      <div className="prose prose-slate prose-sm sm:prose-base max-w-none
        prose-headings:text-slate-900 prose-headings:font-bold
        prose-h2:text-lg prose-h2:border-l-4 prose-h2:border-orange-500 prose-h2:pl-3 prose-h2:mt-10
        prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline">

        <h2>1. Titolare del trattamento</h2>
        <p>
          Il titolare del trattamento dei dati personali raccolti tramite il sito <strong>maestranze.com</strong> è:
        </p>
        <p>
          <strong>Maestranze.com</strong><br />
          Email: <a href="mailto:privacy@maestranze.com">privacy@maestranze.com</a>
        </p>

        <h2>2. Tipologie di dati trattati</h2>
        <p>Maestranze raccoglie e tratta le seguenti categorie di dati personali:</p>
        <ul>
          <li><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, sistema operativo, pagine visitate, timestamp delle visite. Sono raccolti automaticamente dai sistemi informatici del sito.</li>
          <li><strong>Dati forniti volontariamente:</strong> nome, cognome, indirizzo email, numero di telefono, città, partita IVA, descrizione dell&apos;attività lavorativa, forniti tramite i moduli di registrazione, di richiesta preventivo o di contatto.</li>
          <li><strong>Dati di utilizzo della piattaforma:</strong> richieste di preventivo inviate o ricevute, messaggi, recensioni, accessi alla dashboard.</li>
        </ul>

        <h2>3. Finalità e basi giuridiche del trattamento</h2>
        <p>I dati personali sono trattati per le seguenti finalità:</p>
        <ul>
          <li><strong>Erogazione del servizio</strong> (base giuridica: esecuzione del contratto — art. 6 c.1 lett. b GDPR): creazione e gestione dell&apos;account, abbinamento clienti–professionisti, invio di notifiche relative alle richieste di preventivo.</li>
          <li><strong>Adempimenti legali</strong> (base giuridica: obbligo legale — art. 6 c.1 lett. c GDPR): conservazione dei dati fiscali e contabili, risposta a richieste di autorità competenti.</li>
          <li><strong>Interesse legittimo</strong> (art. 6 c.1 lett. f GDPR): sicurezza della piattaforma, prevenzione di frodi e abusi, miglioramento del servizio tramite dati aggregati e anonimi.</li>
          <li><strong>Comunicazioni commerciali e newsletter</strong> (base giuridica: consenso — art. 6 c.1 lett. a GDPR): invio di aggiornamenti, offerte e contenuti informativi. Il consenso è revocabile in qualsiasi momento.</li>
        </ul>

        <h2>4. Modalità del trattamento e conservazione</h2>
        <p>
          I dati sono trattati con strumenti informatici e telematici, con modalità organizzative strettamente correlate alle finalità indicate. I dati sono conservati per il tempo strettamente necessario al perseguimento delle finalità per cui sono stati raccolti e, in ogni caso:
        </p>
        <ul>
          <li>Dati di account: fino alla cancellazione dell&apos;account e per i successivi 30 giorni.</li>
          <li>Dati di richieste di preventivo: 24 mesi dalla data della richiesta.</li>
          <li>Dati per obblighi fiscali: 10 anni dalla registrazione del documento contabile.</li>
          <li>Dati di navigazione: 12 mesi.</li>
        </ul>

        <h2>5. Comunicazione e trasferimento dei dati</h2>
        <p>I dati possono essere comunicati a:</p>
        <ul>
          <li><strong>Professionisti della piattaforma</strong>: i dati di contatto inseriti nelle richieste di preventivo (nome, telefono, email, città) sono condivisi con i professionisti della categoria e zona corrispondenti, affinché possano rispondere alla richiesta.</li>
          <li><strong>Fornitori di servizi tecnici</strong> (responsabili del trattamento ex art. 28 GDPR): Supabase Inc. (database e autenticazione, USA — con garanzie adeguate), Vercel Inc. (hosting, USA — con garanzie adeguate), Resend Inc. (invio email transazionali, USA — con garanzie adeguate).</li>
          <li><strong>Autorità competenti</strong>: in caso di obbligo legale.</li>
        </ul>
        <p>I trasferimenti verso paesi extra-SEE avvengono sulla base delle Clausole Contrattuali Standard approvate dalla Commissione Europea.</p>

        <h2>6. Diritti dell&apos;interessato</h2>
        <p>
          Ai sensi degli artt. 15–22 GDPR, l&apos;interessato ha il diritto di:
        </p>
        <ul>
          <li>accedere ai propri dati personali (art. 15);</li>
          <li>rettificarli se inesatti o incompleti (art. 16);</li>
          <li>ottenerne la cancellazione (&quot;diritto all&apos;oblio&quot;, art. 17);</li>
          <li>limitarne il trattamento (art. 18);</li>
          <li>riceverli in formato strutturato e portabile (art. 20);</li>
          <li>opporsi al trattamento (art. 21);</li>
          <li>revocare il consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento basato sul consenso prestato prima della revoca.</li>
        </ul>
        <p>
          Per esercitare tali diritti, scrivere a <a href="mailto:privacy@maestranze.com">privacy@maestranze.com</a>. Risponderemo entro 30 giorni. È inoltre possibile proporre reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a>).
        </p>

        <h2>7. Cookie e tecnologie di tracciamento</h2>
        <p>
          Il sito utilizza cookie tecnici necessari al funzionamento della piattaforma (es. sessione di autenticazione). Non sono al momento utilizzati cookie di profilazione o di terze parti a fini pubblicitari. Eventuali cookie analitici sono configurati in modalità anonimizzata.
        </p>

        <h2>8. Sicurezza dei dati</h2>
        <p>
          Adottiamo misure tecniche e organizzative adeguate per proteggere i dati personali da accessi non autorizzati, perdita, distruzione o divulgazione non consentita, tra cui: comunicazioni cifrate via HTTPS/TLS, accessi autenticati tramite token sicuri, separazione dei ruoli e politiche di accesso al database.
        </p>

        <h2>9. Modifiche alla presente informativa</h2>
        <p>
          Ci riserviamo il diritto di aggiornare la presente informativa in qualsiasi momento. Le modifiche sostanziali saranno comunicate agli utenti registrati via email. L&apos;utilizzo continuato del servizio dopo la pubblicazione delle modifiche costituisce accettazione della nuova versione.
        </p>

        <h2>10. Contatti</h2>
        <p>
          Per qualsiasi domanda relativa al trattamento dei dati personali:<br />
          <a href="mailto:privacy@maestranze.com">privacy@maestranze.com</a>
        </p>

      </div>
    </div>
    </>
  )
}

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
          <p className="text-slate-300 text-sm">Ultimo aggiornamento: 8 aprile 2025</p>
        </div>
      </section>

      <div className="bg-white dark:bg-slate-950 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-14">
          <div className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">1. Titolare del trattamento</h2>
              <p>
                Il titolare del trattamento dei dati personali raccolti tramite il sito <strong className="text-slate-900 dark:text-white">maestranze.com</strong> è:
              </p>
              <p className="mt-3">
                <strong className="text-slate-900 dark:text-white">Maestranze.com</strong><br />
                Email: <a href="mailto:privacy@maestranze.com" className="text-orange-700 dark:text-orange-400 font-medium hover:underline">privacy@maestranze.com</a>
              </p>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Non è stato designato un Responsabile della Protezione dei Dati (DPO) ai sensi dell&apos;art. 37 GDPR, in quanto non ricorrono le condizioni di cui al medesimo articolo per questa tipologia e dimensione di trattamento.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">2. Tipologie di dati trattati</h2>
              <p>Maestranze raccoglie e tratta le seguenti categorie di dati personali:</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li><strong className="text-slate-900 dark:text-white">Dati di navigazione:</strong> indirizzo IP, tipo di browser, sistema operativo, pagine visitate, timestamp delle visite. Raccolti automaticamente dai sistemi informatici del sito e da strumenti di analisi (vedi sez. 7).</li>
                <li><strong className="text-slate-900 dark:text-white">Dati forniti volontariamente:</strong> nome, cognome, indirizzo email, numero di telefono, città, partita IVA, descrizione dell&apos;attività lavorativa, forniti tramite i moduli di registrazione, di richiesta preventivo o di contatto.</li>
                <li><strong className="text-slate-900 dark:text-white">Dati di utilizzo della piattaforma:</strong> richieste di preventivo inviate o ricevute, messaggi, recensioni, accessi alla dashboard.</li>
              </ul>
              <p className="mt-3">
                <strong className="text-slate-900 dark:text-white">Minori:</strong> la Piattaforma non è rivolta a soggetti di età inferiore a 18 anni. Qualora Maestranze venisse a conoscenza di dati personali di minori raccolti senza consenso dei titolari della responsabilità genitoriale, procederà alla loro immediata cancellazione.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">3. Finalità e basi giuridiche del trattamento</h2>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong className="text-slate-900 dark:text-white">Erogazione del servizio</strong> (art. 6 c.1 lett. b GDPR — esecuzione del contratto): creazione e gestione dell&apos;account, abbinamento artigiani–aziende, invio di notifiche relative alle richieste di preventivo.</li>
                <li><strong className="text-slate-900 dark:text-white">Adempimenti legali</strong> (art. 6 c.1 lett. c GDPR): conservazione dei dati fiscali e contabili, risposta a richieste di autorità competenti.</li>
                <li><strong className="text-slate-900 dark:text-white">Interesse legittimo</strong> (art. 6 c.1 lett. f GDPR): sicurezza della piattaforma, prevenzione di frodi e abusi, analisi aggregata e anonima del comportamento degli utenti per migliorare il servizio.</li>
                <li><strong className="text-slate-900 dark:text-white">Comunicazioni commerciali e newsletter</strong> (art. 6 c.1 lett. a GDPR — consenso): invio di aggiornamenti, offerte e contenuti informativi. Il consenso è revocabile in qualsiasi momento senza pregiudizio per la liceità del trattamento precedente.</li>
                <li><strong className="text-slate-900 dark:text-white">Analisi delle prestazioni del sito tramite Google Analytics</strong> (art. 6 c.1 lett. a GDPR — consenso): raccolta di statistiche aggregate di navigazione. L&apos;uso è condizionato all&apos;espressione del consenso tramite il banner cookie. In assenza di consenso, il tracciamento non viene attivato.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">4. Modalità del trattamento e conservazione</h2>
              <p>
                I dati sono trattati con strumenti informatici e telematici, con modalità strettamente correlate alle finalità indicate. I dati sono conservati per il tempo necessario e in ogni caso:
              </p>
              <ul className="mt-3 space-y-1 list-disc pl-5">
                <li>Dati di account: fino alla cancellazione dell&apos;account e per i successivi 30 giorni.</li>
                <li>Dati di richieste di preventivo: 24 mesi dalla data della richiesta.</li>
                <li>Dati per obblighi fiscali: 10 anni dalla registrazione del documento contabile.</li>
                <li>Dati di navigazione (log server): 12 mesi.</li>
                <li>Dati raccolti via Google Analytics: 14 mesi (configurazione predefinita Google).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">5. Comunicazione e trasferimento dei dati</h2>
              <p>I dati possono essere comunicati a:</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li><strong className="text-slate-900 dark:text-white">Professionisti della piattaforma:</strong> i dati di contatto inseriti nelle richieste di preventivo (nome, telefono, email, città) sono condivisi con i professionisti della categoria e zona corrispondenti, affinché possano rispondere alla richiesta.</li>
                <li><strong className="text-slate-900 dark:text-white">Fornitori di servizi tecnici</strong> (responsabili del trattamento ex art. 28 GDPR): Supabase Inc. (database e autenticazione, USA), Vercel Inc. (hosting e CDN, USA), Resend Inc. (email transazionali, USA), Google LLC (Google Analytics, USA).</li>
                <li><strong className="text-slate-900 dark:text-white">Autorità competenti:</strong> in caso di obbligo legale o su richiesta dell&apos;autorità giudiziaria.</li>
              </ul>
              <p className="mt-3">
                I trasferimenti verso paesi extra-SEE (USA) avvengono sulla base delle <strong className="text-slate-900 dark:text-white">Clausole Contrattuali Standard (SCC)</strong> adottate dalla Commissione Europea con Decisione 2021/914. Per Google Analytics, il trasferimento avviene inoltre nel quadro del Data Privacy Framework UE–USA (adeguatezza, Decisione di esecuzione 2023/1795).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">6. Diritti dell&apos;interessato</h2>
              <p>Ai sensi degli artt. 15–22 GDPR, l&apos;interessato ha il diritto di:</p>
              <ul className="mt-3 space-y-1 list-disc pl-5">
                <li>accedere ai propri dati personali (art. 15);</li>
                <li>rettificarli se inesatti o incompleti (art. 16);</li>
                <li>ottenerne la cancellazione — &quot;diritto all&apos;oblio&quot; (art. 17);</li>
                <li>limitarne il trattamento (art. 18);</li>
                <li>riceverli in formato strutturato e portabile (art. 20);</li>
                <li>opporsi al trattamento basato su interesse legittimo (art. 21);</li>
                <li><strong className="text-slate-900 dark:text-white">non essere sottoposto a decisioni basate esclusivamente su trattamento automatizzato</strong> (art. 22) — Maestranze non effettua profilazioni automatizzate con effetti giuridici o significativi sull&apos;interessato;</li>
                <li>revocare il consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento precedente alla revoca.</li>
              </ul>
              <p className="mt-4">
                Per esercitare questi diritti: <a href="mailto:privacy@maestranze.com" className="text-orange-700 dark:text-orange-400 font-medium hover:underline">privacy@maestranze.com</a>. Risponderemo entro 30 giorni (prorogabili di altri 60 in casi complessi, con comunicazione dei motivi). È possibile proporre reclamo al Garante per la protezione dei dati personali: <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-orange-700 dark:text-orange-400 font-medium hover:underline">www.garanteprivacy.it</a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">7. Cookie e tecnologie di tracciamento</h2>
              <p>Il sito utilizza le seguenti categorie di cookie:</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li><strong className="text-slate-900 dark:text-white">Cookie tecnici necessari</strong> (senza consenso): gestione della sessione di autenticazione, preferenze dell&apos;interfaccia (es. tema scuro/chiaro). Non trasmettono dati a terze parti.</li>
                <li><strong className="text-slate-900 dark:text-white">Cookie analitici di terze parti — Google Analytics 4</strong> (previo consenso): raccolgono dati aggregati sull&apos;utilizzo del sito (pagine visitate, durata sessione, provenienza geografica) per finalità statistiche. Il provider è Google LLC. I dati possono essere trasferiti verso server negli USA (vedi sez. 5). L&apos;indirizzo IP è anonimizzato prima del trasferimento. Per approfondire: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-700 dark:text-orange-400 font-medium hover:underline">policies.google.com/privacy</a>.</li>
              </ul>
              <p className="mt-3">
                Al primo accesso viene presentato un banner di consenso cookie. Il consenso per i cookie analitici è facoltativo e può essere revocato in qualsiasi momento tramite le impostazioni del browser o cancellando i cookie salvati.
              </p>
              <p className="mt-3">
                Non vengono utilizzati cookie di profilazione o remarketing pubblicitario.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">8. Sicurezza dei dati e data breach</h2>
              <p>
                Adottiamo misure tecniche e organizzative adeguate a proteggere i dati personali da accessi non autorizzati, perdita, distruzione o divulgazione, tra cui: comunicazioni cifrate via HTTPS/TLS, accessi autenticati tramite token sicuri, separazione dei ruoli e politiche di accesso al database.
              </p>
              <p className="mt-3">
                In caso di violazione dei dati personali (data breach) che presenti rischi per i diritti e le libertà degli interessati, Maestranze notificherà il Garante entro 72 ore dalla scoperta (art. 33 GDPR). Se il rischio è elevato, gli interessati saranno informati senza indebito ritardo (art. 34 GDPR).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">9. Modifiche alla presente informativa</h2>
              <p>
                Ci riserviamo il diritto di aggiornare la presente informativa. Le modifiche sostanziali saranno comunicate agli utenti registrati via email con congruo preavviso. La data di &quot;Ultimo aggiornamento&quot; in cima alla pagina indica sempre la versione vigente. L&apos;utilizzo continuato del servizio dopo la pubblicazione delle modifiche costituisce accettazione della nuova versione, fermo restando il diritto dell&apos;utente di opporsi e richiedere la cancellazione dell&apos;account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">10. Contatti</h2>
              <p>
                Per qualsiasi domanda relativa al trattamento dei dati personali o per esercitare i diritti di cui alla sez. 6:<br />
                <a href="mailto:privacy@maestranze.com" className="text-orange-700 dark:text-orange-400 font-medium hover:underline">privacy@maestranze.com</a>
              </p>
            </section>

          </div>
        </div>
      </div>
    </>
  )
}

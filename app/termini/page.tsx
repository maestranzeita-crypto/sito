import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Termini di Servizio — Maestranze',
  description: 'Termini e condizioni di utilizzo del marketplace Maestranze.com per artigiani, professionisti e aziende.',
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
          <p className="text-slate-300 text-sm">Ultimo aggiornamento: 8 aprile 2025</p>
        </div>
      </section>

      <div className="bg-white dark:bg-slate-950 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-14">
          <div className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">1. Definizioni e parti del contratto</h2>
              <p>Ai fini dei presenti Termini si intende per:</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li><strong className="text-slate-900 dark:text-white">«Piattaforma»:</strong> il sito web e i servizi digitali accessibili all&apos;indirizzo maestranze.com, gestiti da Maestranze.com.</li>
                <li><strong className="text-slate-900 dark:text-white">«Maestranze»:</strong> il gestore della Piattaforma, titolare del servizio di marketplace digitale.</li>
                <li><strong className="text-slate-900 dark:text-white">«Professionista»:</strong> artigiano, impresa individuale o società che si registra sulla Piattaforma per offrire servizi edili, impiantistici o affini, operando in qualità di lavoratore autonomo titolare di Partita IVA.</li>
                <li><strong className="text-slate-900 dark:text-white">«Cliente»:</strong> persona fisica o giuridica che utilizza la Piattaforma per ricercare professionisti o richiedere preventivi.</li>
                <li><strong className="text-slate-900 dark:text-white">«Utente»:</strong> qualsiasi soggetto che accede alla Piattaforma, sia Professionista che Cliente.</li>
                <li><strong className="text-slate-900 dark:text-white">«Utente Business»:</strong> ai sensi del Reg. UE 2019/1150, il Professionista che utilizza la Piattaforma nell&apos;esercizio della propria attività commerciale, artigianale o professionale.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">2. Accettazione dei termini</h2>
              <p>
                L&apos;accesso e l&apos;utilizzo della Piattaforma comportano l&apos;accettazione integrale dei presenti Termini di Servizio. Se non si accettano le condizioni qui descritte, si prega di non utilizzare la Piattaforma.
              </p>
              <p className="mt-3">
                Maestranze si riserva il diritto di modificare i presenti Termini. Le modifiche vengono comunicate via email o avviso in piattaforma con un preavviso minimo di <strong className="text-slate-900 dark:text-white">15 giorni</strong> prima dell&apos;entrata in vigore, in conformità al Reg. UE 2019/1150 (P2B). Gli Utenti Business che non accettino le modifiche possono recedere senza penali entro tale termine. L&apos;utilizzo continuato del servizio dopo la scadenza del preavviso costituisce accettazione delle nuove condizioni.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">3. Descrizione del servizio e natura della Piattaforma</h2>
              <p>
                Maestranze è un <strong className="text-slate-900 dark:text-white">marketplace digitale di intermediazione tecnologica</strong> che facilita l&apos;incontro tra Professionisti e Clienti nel settore edile e impiantistico.
              </p>
              <p className="mt-3">
                <strong className="text-slate-900 dark:text-white">Maestranze non è un&apos;agenzia per il lavoro e non svolge attività di intermediazione di manodopera ai sensi del D.Lgs. 10 settembre 2003 n. 276.</strong> La Piattaforma non effettua somministrazione di lavoro, non instaura rapporti di lavoro subordinato o parasubordinato con i Professionisti, e non si interpone nei rapporti contrattuali tra Professionisti e Clienti. I Professionisti operano in piena autonomia organizzativa, gestionale ed economica, con propria Partita IVA e nel rispetto della normativa fiscale e previdenziale applicabile alla loro attività.
              </p>
              <p className="mt-3">
                Maestranze agisce quale hosting provider ai sensi dell&apos;art. 6 del Reg. UE 2022/2065 (Digital Services Act). Non ha conoscenza preventiva dei contenuti pubblicati dagli Utenti e non è responsabile degli stessi, salvo nei casi in cui, ricevuta notifica di contenuto illegale, non abbia agito tempestivamente per rimuoverlo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">4. Requisiti di accesso</h2>
              <p>Per utilizzare la Piattaforma è necessario:</p>
              <ul className="mt-3 space-y-1 list-disc pl-5">
                <li>aver compiuto 18 anni di età;</li>
                <li>avere piena capacità giuridica di agire;</li>
                <li>fornire informazioni veritiere, accurate e aggiornate durante la registrazione;</li>
                <li>per i Professionisti: essere titolari di Partita IVA valida e possedere le abilitazioni di legge richieste per i servizi offerti (es. abilitazione ai sensi del D.M. 37/2008 per impianti elettrici, idraulici e termici; patentino per gas; iscrizione CCIAA; qualifiche per la sicurezza nei cantieri).</li>
              </ul>
              <p className="mt-3">
                L&apos;accesso da parte di minori di 18 anni è espressamente vietato. Registrandosi, l&apos;Utente dichiara di possedere i requisiti sopra indicati.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">5. Registrazione e account</h2>
              <p>
                La registrazione alla Piattaforma è gratuita. L&apos;Utente è responsabile della riservatezza delle proprie credenziali di accesso e di tutte le attività svolte tramite il proprio account. In caso di accesso non autorizzato o violazione delle credenziali, l&apos;Utente deve notificarlo immediatamente a <a href="mailto:supporto@maestranze.com" className="text-orange-700 dark:text-orange-400 font-medium hover:underline">supporto@maestranze.com</a>.
              </p>
              <p className="mt-3">
                Maestranze si riserva il diritto di sospendere o cancellare account che violino i presenti Termini, forniscano informazioni false o tengano comportamenti scorretti. In caso di sospensione, l&apos;Utente Business riceverà comunicazione motivata e avrà accesso al sistema di reclami interno (art. 13).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">6. Obblighi del Professionista</h2>
              <p>Il Professionista che si registra su Maestranze si impegna a:</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>fornire informazioni veritiere e aggiornate sul proprio profilo (specializzazioni, zona operativa, certificazioni);</li>
                <li>possedere e mantenere valide tutte le abilitazioni di legge necessarie per i servizi offerti;</li>
                <li>essere titolare di polizza assicurativa RC professionale adeguata all&apos;attività svolta;</li>
                <li>rispettare integralmente le norme in materia di <strong className="text-slate-900 dark:text-white">sicurezza sul lavoro</strong> (D.Lgs. 9 aprile 2008 n. 81 e ss.mm.ii.), di tutela della salute nei cantieri edili e ogni altra normativa di settore applicabile;</li>
                <li>operare nel pieno rispetto della normativa fiscale italiana, emettendo regolare fattura per ogni prestazione e non proponendo accordi in contanti non documentati o pagamenti in nero;</li>
                <li>rispondere alle richieste di preventivo in modo professionale, corretto e tempestivo;</li>
                <li>non contattare i Clienti per finalità diverse da quelle strettamente legate alla richiesta ricevuta tramite Piattaforma;</li>
                <li>non instaurare rapporti di lavoro dipendente non dichiarato con personale impiegato nelle commesse acquisite tramite la Piattaforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">7. Obblighi del Cliente</h2>
              <p>Il Cliente che utilizza Maestranze si impegna a:</p>
              <ul className="mt-3 space-y-1 list-disc pl-5">
                <li>fornire informazioni accurate nelle richieste di preventivo;</li>
                <li>non sollecitare accordi che eludano la normativa fiscale o le norme in materia di sicurezza sul lavoro;</li>
                <li>in qualità di committente, rispettare gli obblighi previsti dal D.Lgs. 81/2008 (nomina coordinatore per la sicurezza, piano di sicurezza, ecc.) ove applicabili;</li>
                <li>trattare i Professionisti con rispetto e correttezza;</li>
                <li>lasciare recensioni veritiere basate sulla propria esperienza diretta.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">8. Contenuti vietati e segnalazione</h2>
              <p>È vietato pubblicare sulla Piattaforma contenuti che:</p>
              <ul className="mt-3 space-y-1 list-disc pl-5">
                <li>siano falsi, ingannevoli o fraudolenti;</li>
                <li>contengano dati di contatto diretti (telefono, email, siti web) nei campi descrittivi del profilo, al fine di eludere la Piattaforma;</li>
                <li>siano diffamatori, offensivi, discriminatori o lesivi dei diritti di terzi;</li>
                <li>violino la normativa vigente in materia di pubblicità, concorrenza sleale, protezione dei consumatori o diritto del lavoro;</li>
                <li>costituiscano contenuto illegale ai sensi del Reg. UE 2022/2065 (DSA);</li>
                <li>contengano virus, malware o codice dannoso.</li>
              </ul>
              <p className="mt-3">
                Chiunque rilevi contenuti illegali o in violazione dei presenti Termini può segnalarli a <a href="mailto:segnalazioni@maestranze.com" className="text-orange-700 dark:text-orange-400 font-medium hover:underline">segnalazioni@maestranze.com</a>. Maestranze esamina ogni segnalazione e adotta i provvedimenti necessari entro un termine ragionevole, conformemente al DSA.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">9. Parametri di posizionamento (ranking)</h2>
              <p>
                Ai sensi dell&apos;art. 5 del Reg. UE 2019/1150, il posizionamento dei profili nei risultati di ricerca è determinato da:
              </p>
              <ul className="mt-3 space-y-1 list-disc pl-5">
                <li>completezza del profilo (descrizione, foto, specializzazioni, certificazioni);</li>
                <li>valutazione media ottenuta dalle recensioni verificate;</li>
                <li>numero e recency delle recensioni ricevute;</li>
                <li>corrispondenza tra la zona operativa dichiarata e la zona di ricerca del Cliente;</li>
                <li>disponibilità dichiarata dall&apos;artigiano.</li>
              </ul>
              <p className="mt-3">
                Maestranze non accetta pagamenti per alterare artificialmente il posizionamento. Eventuali futuri spazi promozionali a pagamento saranno chiaramente etichettati come tali.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">10. Recensioni e reputazione</h2>
              <p>
                Le recensioni sono riservate ai Clienti che hanno effettuato una richiesta di preventivo tramite Maestranze. Maestranze si riserva il diritto di rimuovere recensioni che violino i presenti Termini o che risultino palesemente false, previa verifica. I Professionisti possono segnalare recensioni ritenute improprie a <a href="mailto:segnalazioni@maestranze.com" className="text-orange-700 dark:text-orange-400 font-medium hover:underline">segnalazioni@maestranze.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">11. Responsabilità della Piattaforma e limitazioni</h2>
              <p><strong className="text-slate-900 dark:text-white">Maestranze non è responsabile</strong> per:</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>la qualità, la sicurezza, la conformità normativa o l&apos;esecuzione dei lavori effettuati dai Professionisti;</li>
                <li>il rispetto, da parte dei Professionisti, delle norme in materia di sicurezza sul lavoro (D.Lgs. 81/2008), fiscali, previdenziali o di abilitazione professionale;</li>
                <li>le obbligazioni contrattuali tra Clienti e Professionisti, comprese eventuali controversie relative a pagamenti, garanzie o vizi dell&apos;opera;</li>
                <li>danni diretti o indiretti derivanti dall&apos;uso o dall&apos;impossibilità di utilizzo della Piattaforma, salvi i casi di dolo o colpa grave di Maestranze;</li>
                <li>la veridicità delle informazioni inserite dagli Utenti;</li>
                <li>interruzioni del servizio dovute a manutenzione, guasti tecnici o cause di forza maggiore.</li>
              </ul>
              <p className="mt-3">
                Nei limiti consentiti dalla legge, la responsabilità patrimoniale di Maestranze è in ogni caso limitata all&apos;importo dei corrispettivi eventualmente pagati dall&apos;Utente per piani a pagamento negli ultimi 12 mesi precedenti il fatto dannoso.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">12. Proprietà intellettuale</h2>
              <p>
                Tutti i contenuti della Piattaforma (logo, testi, grafica, codice sorgente) sono di proprietà di Maestranze o dei rispettivi titolari e sono protetti dalla normativa sul diritto d&apos;autore. È vietata la riproduzione, distribuzione o utilizzo commerciale senza autorizzazione scritta.
              </p>
              <p className="mt-3">
                L&apos;Utente, pubblicando contenuti sulla Piattaforma (descrizioni, foto, recensioni), concede a Maestranze una licenza non esclusiva, gratuita, revocabile all&apos;atto della cancellazione dell&apos;account, per utilizzare tali contenuti ai fini dell&apos;erogazione e promozione del servizio.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">13. Sistema di gestione dei reclami (P2B)</h2>
              <p>
                Ai sensi dell&apos;art. 11 del Reg. UE 2019/1150, Maestranze mette a disposizione degli Utenti Business un sistema interno di gestione dei reclami gratuito. I reclami possono riguardare:
              </p>
              <ul className="mt-3 space-y-1 list-disc pl-5">
                <li>sospensione o cancellazione dell&apos;account;</li>
                <li>restrizioni all&apos;accesso ai dati o alle funzionalità;</li>
                <li>applicazione di condizioni contrattuali ritenute non conformi al Reg. UE 2019/1150;</li>
                <li>rimozione di contenuti o recensioni.</li>
              </ul>
              <p className="mt-3">
                I reclami vanno inviati a <a href="mailto:supporto@maestranze.com" className="text-orange-700 dark:text-orange-400 font-medium hover:underline">supporto@maestranze.com</a> con oggetto «Reclamo P2B». Maestranze risponde entro 15 giorni lavorativi, motivando le proprie decisioni.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">14. Servizio gratuito, piani premium e diritto di recesso</h2>
              <p>
                La registrazione e l&apos;utilizzo base della Piattaforma sono attualmente gratuiti. Maestranze si riserva il diritto di introdurre piani a pagamento con funzionalità aggiuntive, dandone preavviso di almeno 30 giorni agli Utenti registrati.
              </p>
              <p className="mt-3">
                Per i servizi a pagamento rivolti a consumatori (persone fisiche che agiscono per scopi estranei all&apos;attività professionale), si applicano le disposizioni del Codice del Consumo (D.Lgs. 206/2005). Il consumatore ha diritto di recedere entro <strong className="text-slate-900 dark:text-white">14 giorni</strong> dalla stipula, senza necessità di fornire motivazioni, salvo che abbia espressamente richiesto l&apos;inizio immediato del servizio.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">15. Recesso dell&apos;Utente e cancellazione account</h2>
              <p>
                L&apos;Utente può cancellare il proprio account in qualsiasi momento scrivendo a <a href="mailto:supporto@maestranze.com" className="text-orange-700 dark:text-orange-400 font-medium hover:underline">supporto@maestranze.com</a>. La cancellazione comporta la rimozione del profilo dalla Piattaforma. I dati saranno conservati nei termini previsti dalla Privacy Policy e dagli obblighi di legge.
              </p>
              <p className="mt-3">
                Maestranze può recedere dal contratto in caso di violazione grave dei presenti Termini, con effetto immediato. Per violazioni non gravi, Maestranze fornisce preavviso motivato di almeno 15 giorni prima della sospensione, in conformità al Reg. UE 2019/1150 per gli Utenti Business.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">16. Forza maggiore</h2>
              <p>
                Maestranze non è responsabile per ritardi o inadempimenti causati da eventi di forza maggiore, ossia eventi straordinari, imprevedibili e non controllabili, tra cui: calamità naturali, pandemie, interruzioni delle reti di comunicazione, atti di terrorismo, blackout energetici, provvedimenti delle autorità pubbliche. In tali casi Maestranze informa tempestivamente gli Utenti e adotta ogni ragionevole misura per ripristinare il servizio.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">17. Clausola di salvaguardia</h2>
              <p>
                Qualora una o più disposizioni dei presenti Termini siano ritenute nulle, invalide o inapplicabili, le restanti disposizioni rimangono pienamente valide ed efficaci. La disposizione nulla sarà sostituita, nei limiti del possibile, da una disposizione valida che realizzi nel miglior modo possibile lo scopo economico della disposizione originaria.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">18. Legge applicabile, foro competente e ADR</h2>
              <p>
                I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia derivante dall&apos;utilizzo della Piattaforma, le parti concordano la competenza del Foro di Milano, salvo diversa disposizione inderogabile di legge a tutela del consumatore (che conserva il diritto di adire il foro del proprio domicilio).
              </p>
              <p className="mt-3">
                Per la risoluzione alternativa delle controversie con consumatori (ADR), Maestranze aderisce alla procedura di mediazione prevista dal D.Lgs. 28/2010. I consumatori UE possono altresì accedere alla piattaforma ODR: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-orange-700 dark:text-orange-400 font-medium hover:underline">ec.europa.eu/consumers/odr</a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-3 mb-4">19. Contatti e punto di contatto DSA</h2>
              <p>
                Per domande sui presenti Termini, per segnalazioni di contenuti illegali ai sensi del Reg. UE 2022/2065 (DSA) o per comunicazioni con le autorità competenti:<br />
                <a href="mailto:supporto@maestranze.com" className="text-orange-700 dark:text-orange-400 font-medium hover:underline">supporto@maestranze.com</a>
              </p>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Le autorità degli Stati membri e la Commissione Europea possono contattare Maestranze tramite il medesimo indirizzo, specificando nell&apos;oggetto «Comunicazione Ufficiale DSA».
              </p>
            </section>

          </div>
        </div>
      </div>
    </>
  )
}

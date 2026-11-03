// Textbausteine für Impressum und Datenschutzerklärung. {{feld}} wird aus owner.ts ersetzt.
// Wichtig: Das ist eine Vorlage, keine Rechtsberatung. Vor der Veröffentlichung prüfen (lassen).

export type Section = { h: string; p: string[] };
type Doc = { title: string; intro?: string; sections: Section[] };
type Lang = { imprint: Doc; privacy: Doc };

export const LEGAL: { de: Lang; en: Lang } = {
  de: {
    imprint: {
      title: "Impressum",
      sections: [
        {
          h: "Angaben gemäß § 5 DDG",
          p: ["{{name}}", "{{street}}", "{{zip}} {{city}}"],
        },
        {
          h: "Kontakt",
          p: ["E-Mail: {{email}}", "Telefon: {{phone}}"],
        },
        {
          h: "Verantwortlich für Inhalte nach § 18 Abs. 2 MStV",
          p: ["{{name}}, {{street}}, {{zip}} {{city}}"],
        },
        {
          h: "Hinweis zu Inhalten",
          p: [
            "Kursbuch ist ein Informations- und Lernangebot. Alle Kurse, Analysen und Beiträge dienen nur der Information und sind keine Anlageberatung, keine Kauf- oder Verkaufsempfehlung und keine Aufforderung zum Handel. Der Handel mit Kryptowährungen ist mit hohen Risiken bis zum Totalverlust verbunden.",
            "Beiträge und Analysen stammen von Nutzerinnen und Nutzern. Für diese Inhalte sind die jeweiligen Verfasser verantwortlich. Hinweise auf rechtswidrige Inhalte nehmen wir unter der oben genannten E-Mail-Adresse entgegen und prüfen sie zeitnah.",
          ],
        },
        {
          h: "Datenquellen",
          p: ["Kursdaten stammen von CoinGecko (coingecko.com). Der Chart im Rechner wird von TradingView bereitgestellt (tradingview.com)."],
        },
      ],
    },
    privacy: {
      title: "Datenschutzerklärung",
      intro: "Hier erfährst du, welche personenbezogenen Daten wir verarbeiten, wenn du Kursbuch nutzt, und welche Rechte du hast.",
      sections: [
        {
          h: "1. Verantwortlicher",
          p: ["{{name}}, {{street}}, {{zip}} {{city}}", "E-Mail: {{email}}"],
        },
        {
          h: "2. Hosting und Server-Logs",
          p: [
            "Die Seite läuft auf einem Server der Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen (Deutschland). Beim Aufruf verarbeitet der Webserver technisch notwendige Daten (IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse, Browserangaben) in Logdateien, um die Seite auszuliefern und Missbrauch abzuwehren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (Sicherheit und Betrieb). Die Logs werden nach kurzer Zeit gelöscht.",
          ],
        },
        {
          h: "3. Konto und Profil",
          p: [
            "Wenn du ein Konto anlegst, speichern wir Vorname, Nachname, E-Mail-Adresse, dein Passwort (nur als Hash, nicht lesbar), optional Profilbild, Beschreibung und Geschlecht sowie deine Inhalte (Beiträge, Kommentare, Journal-Einträge) und Aktivitäten wie Follower. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Nutzungsvertrag). Wir speichern die Daten, bis du dein Konto löschst. Du kannst es jederzeit unter Einstellungen löschen.",
            "Dein Name, dein Profilbild und deine Beiträge sind für andere Nutzer sichtbar. Deine E-Mail-Adresse ist nicht öffentlich.",
          ],
        },
        {
          h: "4. Cookies und lokaler Speicher",
          p: [
            "Wir setzen nur technisch notwendige Speicherungen ein: ein Anmelde-Cookie (damit du angemeldet bleibst) sowie lokale Einstellungen in deinem Browser (Sprache, helles oder dunkles Design, deine Nutzer-ID, Auswahl zum TradingView-Chart). Dafür ist nach § 25 Abs. 2 TDDDG keine Einwilligung nötig. Es gibt keine Werbe- oder Tracking-Cookies und keine Analyse-Dienste.",
          ],
        },
        {
          h: "5. E-Mail-Versand",
          p: [
            "Für Bestätigungs- und Passwort-Codes senden wir dir E-Mails über {{mailService}}. Dabei werden deine E-Mail-Adresse und der Inhalt der Nachricht an den Dienst übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.",
          ],
        },
        {
          h: "6. Kursdaten",
          p: [
            "Unser Server ruft Kursdaten bei CoinGecko ab und speichert sie in unserer Datenbank. Dabei werden keine Daten von dir an CoinGecko übermittelt, und dein Browser lädt diese Daten nur von unserem Server.",
          ],
        },
        {
          h: "7. TradingView-Chart (nur mit deiner Einwilligung)",
          p: [
            "Im Rechner kannst du einen Chart von TradingView anzeigen. Erst wenn du auf „Chart laden“ klickst, lädt dein Browser Inhalte von TradingView Inc. (USA). Dabei wird deine IP-Adresse an TradingView übertragen, und TradingView kann eigene Cookies setzen. Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Du kannst sie jederzeit im Chart-Bereich widerrufen. Die Übermittlung in die USA stützt sich auf den Angemessenheitsbeschluss zum EU-US Data Privacy Framework, soweit TradingView zertifiziert ist.",
          ],
        },
        {
          h: "8. Zahlung mit PayPal",
          p: [
            "Für das kostenpflichtige Journal kannst du mit PayPal bezahlen. Beim Öffnen der Zahlungsseite wird der PayPal-Dienst der PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxemburg, geladen und deine Daten für die Zahlung werden dort verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Es gilt die Datenschutzerklärung von PayPal.",
          ],
        },
        {
          h: "9. Schriften",
          p: ["Alle Schriften werden von unserem eigenen Server geladen. Es werden keine Daten an Google übertragen."],
        },
        {
          h: "10. Deine Rechte",
          p: [
            "Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15 bis 21 DSGVO). Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen. Schreibe uns dazu an {{email}}.",
            "Du kannst dich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei: {{authority}}.",
          ],
        },
        {
          h: "11. Sicherheit",
          p: ["Die Verbindung zur Seite ist per TLS verschlüsselt. Passwörter speichern wir ausschließlich als Hash."],
        },
      ],
    },
  },
  en: {
    imprint: {
      title: "Legal notice",
      sections: [
        { h: "Provider (§ 5 DDG)", p: ["{{name}}", "{{street}}", "{{zip}} {{city}}"] },
        { h: "Contact", p: ["Email: {{email}}", "Phone: {{phone}}"] },
        { h: "Responsible for content (§ 18 (2) MStV)", p: ["{{name}}, {{street}}, {{zip}} {{city}}"] },
        {
          h: "About the content",
          p: [
            "Kursbuch is an information and learning service. All prices, analyses and posts are for information only. They are not investment advice, not a recommendation to buy or sell and not an invitation to trade. Trading cryptocurrencies carries a high risk, up to the total loss of your money.",
            "Posts and analyses are written by users, who are responsible for their own content. Please report unlawful content to the email address above and we will review it promptly.",
          ],
        },
        {
          h: "Data sources",
          p: ["Price data comes from CoinGecko (coingecko.com). The chart in the calculator is provided by TradingView (tradingview.com)."],
        },
      ],
    },
    privacy: {
      title: "Privacy policy",
      intro: "This page explains which personal data we process when you use Kursbuch and which rights you have.",
      sections: [
        { h: "1. Controller", p: ["{{name}}, {{street}}, {{zip}} {{city}}", "Email: {{email}}"] },
        {
          h: "2. Hosting and server logs",
          p: [
            "The site runs on a server of Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen (Germany). When you visit, the web server processes technically necessary data (IP address, date and time, requested address, browser details) in log files to deliver the site and prevent abuse. The legal basis is Art. 6(1)(f) GDPR (security and operation). Logs are deleted after a short time.",
          ],
        },
        {
          h: "3. Account and profile",
          p: [
            "When you create an account we store your first and last name, email address, your password (only as an unreadable hash), optionally a profile photo, a bio and gender, as well as your content (posts, comments, journal entries) and activity such as followers. The legal basis is Art. 6(1)(b) GDPR (contract). We keep the data until you delete your account, which you can do at any time under Settings.",
            "Your name, profile photo and posts are visible to other users. Your email address is not public.",
          ],
        },
        {
          h: "4. Cookies and local storage",
          p: [
            "We only use technically necessary storage: a login cookie (so you stay signed in) and local settings in your browser (language, light or dark theme, your user ID, your choice about the TradingView chart). Under § 25 (2) TDDDG no consent is required for this. There are no advertising or tracking cookies and no analytics services.",
          ],
        },
        {
          h: "5. Sending email",
          p: [
            "We send verification and password codes by email through {{mailService}}. Your email address and the content of the message are passed to that service. The legal basis is Art. 6(1)(b) GDPR.",
          ],
        },
        {
          h: "6. Price data",
          p: ["Our server fetches price data from CoinGecko and stores it in our database. No data about you is sent to CoinGecko, and your browser only loads this data from our server."],
        },
        {
          h: "7. TradingView chart (only with your consent)",
          p: [
            "In the calculator you can show a chart from TradingView. Only after you click “Load chart” does your browser load content from TradingView Inc. (USA). Your IP address is sent to TradingView, and TradingView may set its own cookies. The legal basis is your consent (Art. 6(1)(a) GDPR, § 25 (1) TDDDG). You can withdraw it at any time in the chart area. The transfer to the USA relies on the EU-US Data Privacy Framework adequacy decision, as far as TradingView is certified.",
          ],
        },
        {
          h: "8. Payment with PayPal",
          p: [
            "You can pay for the paid journal with PayPal. When you open the payment page, the service of PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxembourg is loaded and your payment data is processed there. The legal basis is Art. 6(1)(b) GDPR. PayPal's privacy policy applies.",
          ],
        },
        {
          h: "9. Fonts",
          p: ["All fonts are loaded from our own server. No data is sent to Google."],
        },
        {
          h: "10. Your rights",
          p: [
            "You have the right of access, rectification, erasure, restriction of processing, data portability and objection (Art. 15 to 21 GDPR). You can withdraw consent at any time with effect for the future. Write to us at {{email}}.",
            "You can also complain to a data protection authority, for example: {{authority}}.",
          ],
        },
        { h: "11. Security", p: ["The connection to the site is encrypted with TLS. We store passwords only as a hash."] },
      ],
    },
  },
};

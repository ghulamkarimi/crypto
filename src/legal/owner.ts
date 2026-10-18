// Hier EINMAL deine Angaben eintragen. Sie erscheinen im Impressum und in der Datenschutzerklärung.
// Leere Felder werden auf der Seite als gelbe [Platzhalter] angezeigt.
export const OWNER = {
  name: "", // Vor- und Nachname
  street: "", // Straße und Hausnummer
  zip: "", // Postleitzahl
  city: "", // Ort
  email: "", // E-Mail-Adresse für Anfragen
  phone: "", // Telefon (optional)
  mailService: "", // E-Mail-Dienst, über den Bestätigungscodes versendet werden, z. B. Google (Gmail)
  authority: "", // zuständige Datenschutz-Aufsichtsbehörde, z. B. Der Hessische Beauftragte für Datenschutz und Informationsfreiheit
};

export type OwnerKey = keyof typeof OWNER;

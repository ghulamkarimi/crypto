import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import MaxWithWrapper from "../components/MaxWithWrapper";
import { OWNER, OwnerKey } from "../legal/owner";
import { LEGAL } from "../legal/content";

interface ILegalPageProps {
  kind: "imprint" | "privacy";
}

const LABELS: Record<OwnerKey, string> = {
  name: "Name",
  street: "Straße",
  zip: "PLZ",
  city: "Ort",
  email: "E-Mail",
  phone: "Telefon",
  mailService: "E-Mail-Dienst",
  authority: "Aufsichtsbehörde",
};

// Ersetzt {{feld}} durch den Wert aus owner.ts. Leere Felder werden als gelber Platzhalter gezeigt.
const fill = (text: string) =>
  text.split(/(\{\{\w+\}\})/g).map((part, i) => {
    const m = part.match(/^\{\{(\w+)\}\}$/);
    if (!m) return <Fragment key={i}>{part}</Fragment>;
    const key = m[1] as OwnerKey;
    const value = OWNER[key];
    return value ? (
      <Fragment key={i}>{value}</Fragment>
    ) : (
      <mark key={i} className="bg-PRIMARY_ORANGE/25 text-PRIMARY_ORANGE px-1 rounded">[{LABELS[key] ?? key}]</mark>
    );
  });

const LegalPage = ({ kind }: ILegalPageProps) => {
  const { i18n } = useTranslation();
  const doc = LEGAL[i18n.language.startsWith("de") ? "de" : "en"][kind];

  return (
    <MaxWithWrapper className="py-12 min-h-screen">
      <article className="max-w-3xl flex flex-col gap-8">
        <h1 className="text-5xl">{doc.title}</h1>
        {doc.intro && <p className="muted leading-7">{doc.intro}</p>}
        {doc.sections.map((s) => (
          <section key={s.h} className="flex flex-col gap-3">
            <h2 className="text-2xl">{s.h}</h2>
            {s.p.map((para, i) => (
              <p key={i} className="leading-7">{fill(para)}</p>
            ))}
          </section>
        ))}
      </article>
    </MaxWithWrapper>
  );
};

export default LegalPage;

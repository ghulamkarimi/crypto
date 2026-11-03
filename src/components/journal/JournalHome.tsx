import { useTranslation } from "react-i18next";
import { IoMdCheckmarkCircle } from "react-icons/io"; // Importiere das Häkchen-Symbol von react-icons/io
import { fadeIn } from "../../utils/motin"; // Importiere die fadeIn-Animationsfunktion aus den Motin-Utilities
import { motion } from "framer-motion"; // Importiere motion von framer-motion für Animationen

const JournalHome = () => {
  const { t } = useTranslation();
  return (
    <div className="font-FONT_VIGA flex flex-col xl:flex-row xl:items-center gap-12">
      {/* Bildbereich */}
      <div className="flex w-full">
        <img className="rounded-lg border border-[var(--line)]" src="/journal.png" alt="" /> {/* Bild */}
      </div>
      {/* Textbereich mit Einblendungsanimation */}
      <motion.div
        variants={fadeIn("left", 0.8)} // Animationsvarianten und -eigenschaften
        initial="hidden" // Startzustand der Animation
        whileInView={"show"} // Animation wird gestartet, wenn das Element im sichtbaren Bereich ist
        viewport={{ margin: "50px" }} // Sichtbarer Bereich für die Animation
      >
        <div className=" w-full flex-col place-item-center">
          {/* Überschrift */}
          <h2 className="text-[clamp(40px,5vw,56px)] leading-[0.98] mb-5">{t("journalHome.title")}</h2>
          {/* Textabschnitt */}
          <p className="muted max-w-[60ch]">
            {t("journalHome.p1")}
          </p>
          {/* Abschnitt mit Häkchen-Symbol und Text */}
          <div className="flex mt-6 items-start gap-3">
            <IoMdCheckmarkCircle className="text-3xl shrink-0 text-SECONDARY_BLUE" />{" "}
            {/* Häkchen-Symbol */}
            <p>
              {t("journalHome.p2")}
            </p>
          </div>
          {/* Abschnitt mit Häkchen-Symbol und Text */}
          <div className="flex py-6 items-start gap-3">
            <IoMdCheckmarkCircle className="text-3xl shrink-0 text-SECONDARY_BLUE" />{" "}
            {/* Häkchen-Symbol */}
            <p className="max-w-[60ch]">
              {t("journalHome.p3")}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JournalHome;

import i18n from "../i18n";

// Name des Autors; wenn der Nutzer nicht (mehr) existiert, ein Platzhalter statt "undefined undefined"
export const authorName = (user?: { firstName?: string; lastName?: string } | null): string => {
  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  return name || i18n.t("common.unknownAuthor");
};

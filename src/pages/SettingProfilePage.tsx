import { useState } from "react";
import { useTranslation } from "react-i18next";
import MaxWithWrapper from "../components/MaxWithWrapper";
import EditProfileInfo from "../components/user/profile/EditProfileInfo";
import ChangePassword from "../components/user/profile/ChangePassword";
import VerifyAccount from "../components/user/profile/VerifyAccount";
import ExamRequest from "../components/user/profile/ExamRequest";
import DeleteAccount from "../components/user/profile/DeleteAccount";

type Tab = "profile" | "password" | "verify" | "exam" | "delete";

const SettingProfilePage = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState<Tab>("profile");

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: t("profile.tabProfile") },
    { key: "password", label: t("profile.tabPassword") },
    { key: "verify", label: t("profile.tabVerify") },
    { key: "exam", label: t("profile.tabExam") },
    { key: "delete", label: t("profile.tabDelete") },
  ];

  return (
    <MaxWithWrapper className="py-10 min-h-screen">
      <h1 className="text-4xl sm:text-5xl mb-8">{t("profile.settingsTitle")}</h1>
      <div className="flex flex-col lg:flex-row gap-x-14 gap-y-8">
        <nav className="lg:w-60 flex-none" aria-label={t("profile.settingsTitle")}>
          <ul className="flex flex-wrap lg:flex-col gap-1">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  type="button"
                  onClick={() => setActive(tab.key)}
                  aria-current={active === tab.key ? "page" : undefined}
                  className={`w-full text-left px-3 py-2 rounded text-[15px] lg:text-base outline-none focus-visible:bg-[var(--hover)] ${
                    active === tab.key
                      ? "bg-[var(--hover)] text-PRIMARY_ORANGE font-medium"
                      : "hover:bg-[var(--hover)]"
                  } ${tab.key === "delete" && active !== "delete" ? "text-SECONDARY_RED" : ""}`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex-1 min-w-0">
          {active === "profile" && <EditProfileInfo />}
          {active === "password" && <ChangePassword />}
          {active === "verify" && <VerifyAccount />}
          {active === "exam" && <ExamRequest />}
          {active === "delete" && <DeleteAccount />}
        </div>
      </div>
    </MaxWithWrapper>
  );
};

export default SettingProfilePage;

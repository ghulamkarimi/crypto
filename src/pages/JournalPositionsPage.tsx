import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import MaxWithWrapper from "../components/MaxWithWrapper";
import Positions from "../components/journal/Positions";
import Position from "../components/journal/Position";
import { setJournalId } from "../feature/reducers/journalSlice";
import NavLeft from "../components/journal/NavLeft";
import NavRight from "../components/journal/NavRight";

const JournalPositionsPage = () => {
  const { journalId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(setJournalId(journalId));
  }, [journalId, dispatch]);

  return (
    <MaxWithWrapper>
      <div className="py-10 flex flex-wrap gap-x-14 gap-y-12">
        <div className="flex-[999_1_520px] min-w-0">
          <h1 className="mb-8 text-5xl">{t("journalPage.title")}</h1>
          {journalId === undefined ? <Positions /> : <Position />}
        </div>
        <aside className="flex-[1_1_300px] min-w-0 flex flex-col gap-10 lg:pt-[72px]">
          <NavLeft />
          <NavRight />
        </aside>
      </div>
    </MaxWithWrapper>
  );
};

export default JournalPositionsPage;

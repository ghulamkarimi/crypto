import MaxWithWrapper from "../components/MaxWithWrapper";
import Calc from "../components/calc/Calc";
import ChartConsent from "../components/tradingview/ChartConsent";

// Rechner links, TradingView-Chart (Live-Kurse) rechts.
const CalcPage = () => {
  return (
    <MaxWithWrapper className="min-h-screen py-10">
      <div className="flex flex-wrap gap-x-12 gap-y-10">
        <div className="flex-[1_1_420px] min-w-0">
          <Calc />
        </div>
        <div className="flex-[1_1_480px] min-w-0 min-h-[600px]">
          <ChartConsent />
        </div>
      </div>
    </MaxWithWrapper>
  );
};

export default CalcPage;

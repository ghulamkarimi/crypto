import { NavLink } from "react-router-dom";
import { BRAND_NAME } from "../../../brand";

const Branding = () => {
  return (
    <NavLink
      to="/home"
      className="cursor-pointer font-ANTON font-extrabold text-3xl md:text-[32px] leading-none tracking-[0.01em] hover:!text-PRIMARY_ORANGE"
    >
      {BRAND_NAME}
    </NavLink>
  );
};

export default Branding;

import { ORGANISATION_NAME } from "@/config/contants";
import LogoIcon from "./logo-icon";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <LogoIcon />
      <p className="text-shadow-sm">{ORGANISATION_NAME}</p>
    </div>
  );
};

export default Logo;

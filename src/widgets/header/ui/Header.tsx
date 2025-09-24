import { ROUTES } from "@/shared/router/constants";
import type { JSX } from "react";
import { Link } from "react-router-dom";

export const Header = ({ profile }: { profile: JSX.Element }) => {
  return (
    <header className="p-4 flex justify-between items-center bg-gray-800 text-white">
      <Link to={ROUTES.HOME}>Logo</Link>
      {profile}
    </header>
  );
};

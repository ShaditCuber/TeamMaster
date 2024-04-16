import React from "react";
import { IconTeamMaster } from "../../Icons/Icons";

const Footer = () => {
  return (
    <footer className="border-t w-full">
      <section className="mx-auto max-w-screen-xl px-2 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-y-4">
        <div className="flex items-center justify-center gap-x-2">
          <IconTeamMaster width={20} height={20} />
          <a
            href="#"
            className="text-xl font-semibold text-red-500 inline-flex items-center"
          >
            Team<span className="text-blue-500">Master</span>
          </a>
        </div>

        <p className="text-center text-sm text-gray-500">
          Copyright TeamMaster &copy; {new Date().getFullYear()}. All rights
          reserved.
        </p>
      </section>
    </footer>
  );
};

export default Footer;

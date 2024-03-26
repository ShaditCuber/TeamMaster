import React from "react";
import { IconTeamMaster } from "../../Icons/Icons";

const Footer = () => {

  return (
    <footer className="border-t w-full">
      <div className="mx-auto max-w-screen-xl px-4 py-2 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center justify-center">
            <IconTeamMaster width={20} height={20} />
            <a
              href="#"
              className="mt-4 text-xl font-semibold mb-4 text-red-500 inline-flex items-center mx-4"
            >
              Team<span className="text-blue-500">Master</span>
            </a>
          </div>

          <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
            Copyright TeamMaster &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

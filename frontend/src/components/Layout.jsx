import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Player from "./Player";

const Layout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-[#000] text-white">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Body */}
        <div className="flex-1 flex flex-col m-2 rounded-2xl bg-[#121212] shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <Navbar />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scroll">
            {children}
          </div>
        </div>
      </div>

      {/* Player */}
      <div className="border-t border-gray-700">
        <Player />
      </div>
    </div>
  );
};

export default Layout;

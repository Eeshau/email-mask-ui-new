import React, { useState } from "react";
import Link from "next/link"; // Import Link from Next.js

interface NavBarProps {
  mode: 'home' | 'verify' | 'prove';
  onCompareChanges?: () => void;
  onResetChanges?: () => void;
  onChangeEmail?: () => void;
  onViewSteps?: () => void;
  activeSection: string; // to highlight active section
}

const NavBar: React.FC<NavBarProps> = ({
  mode,
  onCompareChanges = () => {},
  onResetChanges = () => {},
  onChangeEmail = () => {},
  onViewSteps = () => {},
  activeSection,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      className={`z-10 flex items-center py-2 w-full font-sans text-[10px] sm:text-[14px] ${
        mode === 'prove' ? 'justify-between' : 'justify-start'
      }`}
    >
      {/* Left Side */}
      <div className="flex items-center space-x-1 sm:space-x-4 bg-[#161819] px-2 sm:px-4 py-1 rounded-[8px] shadow-lg border border-[#3B3B3B] whitespace-nowrap">
        
        <Link href="/">
        <div className="text-white font-200 px-1 sm:px-0">
          <span className="font-semibold">ZK </span>
          Whistleblower
        </div>
        </Link>

        {/* Divider */}
        <div className="border-l border-gray-600 h-6 mx-1 sm:mx-"></div>

        {/* Conditionally render 'Prove' & 'Verify' buttons */}
        {(mode === 'home' || mode==='verify') && (
          <>
  
            <Link href="/prove">
              <button
                className={`px-2 sm:px-4 py-2 rounded-md ${
                  activeSection === 'prove'
                    ? 'text-white font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Prove
              </button>
            </Link>
            {/* Divider */}
            {mode === 'home' ? 
            <div className="border-l border-gray-600 h-6 mx-1 sm:mx-2"></div>
            : <></>}
          </>
        )}

        {(mode === 'home' || mode==='prove') && (
        <Link href="https://sdk.prove.email/" target="_blank">
          <button
            className='px-2 sm:px-4 py-2 rounded-md text-gray-400 hover:text-white'
          >
            Verify
          </button>
        </Link>
        )}
      </div>

      {/* Right Side */}
      {mode === 'prove' && (
        <>
          {/* Transparent Spacer */}
          <div className="flex-1" />

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center space-x-0 bg-[#161819] px-4 py-1 rounded-[8px] shadow-lg border border-[#3B3B3B]">
          <button
              onClick={onChangeEmail}
              className={`px-4 py-2 ${
                activeSection === "change"
                  ? "text-white font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Change Email
            </button>
            <div className="border-l border-gray-600 h-6 mx-2"></div>
            <button
              onClick={onCompareChanges}
              className={`px-4 py-2 rounded-l-md ${
                activeSection === "compare"
                  ? "text-white font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Compare changes
            </button>
            <div className="border-l border-gray-600 h-6 mx-2"></div>
            <button
              onClick={onResetChanges}
              className={`px-4 py-2 ${
                activeSection === "reset"
                  ? "text-white font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Reset changes
            </button>
            <div className="border-l border-gray-600 h-6 mx-2"></div>
            <button
              onClick={onViewSteps}
              className={`px-4 py-2 rounded-r-md ${
                activeSection === "steps"
                  ? "text-white font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              View Steps
            </button>
          </div>

          {/* Right Side - Mobile */}
          <div className="relative lg:hidden">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center bg-[#161819] px-4 py-3 rounded-[8px] shadow-lg border border-[#3B3B3B] text-gray-400 hover:text-white whitespace-nowrap"
            >
              {/* Display the active section name */}
              {(() => {
                switch (activeSection) {
                  case "compare":
                    return "Compare changes";
                  case "reset":
                    return "Reset changes";
                  case "change":
                    return "Change Email";
                  case "steps":
                    return "View Steps";
                  default:
                    return "Menu";
                }
              })()}
              {/* Dropdown arrow icon */}
              <svg
                className={`w-4 h-4 ml-2 transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#161819] rounded-[8px] shadow-lg border border-[#3B3B3B] z-10">
                <button
                  onClick={() => {
                    onChangeEmail();
                    setIsDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 ${
                    activeSection === "change"
                      ? "text-white font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Change Email
                </button>
                <button
                  onClick={() => {
                    onCompareChanges();
                    setIsDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 ${
                    activeSection === "compare"
                      ? "text-white font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Compare changes
                </button>
                <button
                  onClick={() => {
                    onResetChanges();
                    setIsDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 ${
                    activeSection === "reset"
                      ? "text-white font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Reset changes
                </button>
                <button
                  onClick={() => {
                    onViewSteps();
                    setIsDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 ${
                    activeSection === "steps"
                      ? "text-white font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  View Steps
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;

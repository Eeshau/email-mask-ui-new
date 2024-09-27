import React from "react";

interface NavBarProps {
  onCompareChanges: () => void;
  onResetChanges: () => void;
  onChangeEmail: () => void;
  onViewSteps: () => void;
  activeSection: string; // to highlight active section
}

const NavBar: React.FC<NavBarProps> = ({
  onCompareChanges,
  onResetChanges,
  onChangeEmail,
  onViewSteps,
  activeSection,
}) => {
  return (
    <div className="flex justify-between items-center px-6 py-2 w-full font-sans">
      {/* Left Side */}
      <div className="flex items-center space-x-4 bg-[#26272E] px-4 py-2 rounded-md shadow-lg">
        <div className="text-white font-semibold">
          ZK Whistleblower
        </div>

        {/* Divider between Whistleblower and Verify */}
        <div className="border-l border-gray-600 h-6 mx-2 mx-2 h-full"></div>

        <button
          className={`px-4 py-2 rounded-md ${
            activeSection === "verify"
              ? "text-white font-semibold"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Verify
        </button>
      </div>

      {/* Transparent Spacer */}
      <div className="flex-1" />

      {/* Right Side */}
      <div className="flex items-center space-x-0 bg-[#26272E] px-4 py-2 rounded-[10px] shadow-lg">
        <button
          onClick={onCompareChanges}
          className={`px-4 py-2 rounded-l-md ${
            activeSection === "compare"
              ? " text-white font-semibold"
              : "text-gray-400  hover:text-white"
          }`}
        >
          Compare changes
        </button>
        <div className="border-l border-gray-600 h-6 mx-2"></div>
        <button
          onClick={onResetChanges}
          className={`px-4 py-2  ${
            activeSection === "reset"
              ? " text-white font-semibold"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Reset changes
        </button>
        <div className="border-l border-gray-600 h-6 mx-2"></div>
        <button
          onClick={onChangeEmail}
          className={`px-4 py-2  ${
            activeSection === "change"
              ? " text-white font-semibold"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Change Email
        </button>
        <div className="border-l border-gray-600 h-6 center mx-2"></div>
        <button
          onClick={onViewSteps}
          className={`px-4 py-2 rounded-r-md ${
            activeSection === "steps"
              ? " text-white font-semibold"
              : "text-gray-400 hover:text-white"
          }`}
        >
          View Steps
        </button>
      </div>
    </div>
  );
};

export default NavBar;

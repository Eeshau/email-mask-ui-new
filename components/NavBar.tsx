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
    <div className="flex justify-between items-center bg-gray-800 px-6 py-2 rounded-md">
      {/* Left Side */}
      <div className="flex space-x-4">
        <div className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md">
          ZK Whistleblower
        </div>
        <button
          className={`px-4 py-2 ${
            activeSection === "verify"
              ? "bg-gray-600 text-white"
              : "text-gray-400 hover:bg-gray-700"
          } rounded-md`}
        >
          Verify
        </button>
      </div>

      {/* Right Side */}
      <div className="flex space-x-4">
        <button
          onClick={onCompareChanges}
          className={`px-4 py-2 ${
            activeSection === "compare"
              ? "bg-gray-600 text-white"
              : "text-gray-400 hover:bg-gray-700"
          } rounded-md`}
        >
          Compare changes
        </button>
        <button
          onClick={onResetChanges}
          className={`px-4 py-2 ${
            activeSection === "reset"
              ? "bg-gray-600 text-white"
              : "text-gray-400 hover:bg-gray-700"
          } rounded-md`}
        >
          Reset changes
        </button>
        <button
          onClick={onChangeEmail}
          className={`px-4 py-2 ${
            activeSection === "change"
              ? "bg-gray-600 text-white"
              : "text-gray-400 hover:bg-gray-700"
          } rounded-md`}
        >
          Change Email
        </button>
        <button
          onClick={onViewSteps}
          className={`px-4 py-2 ${
            activeSection === "steps"
              ? "bg-gray-600 text-white"
              : "text-gray-400 hover:bg-gray-700"
          } rounded-md`}
        >
          View Steps
        </button>
      </div>
    </div>
  );
};

export default NavBar;

import React from "react";

const Steps: React.FC = () => {
  return (
    <div className="p-6 bg-[#141517] rounded-[24px] max-w-md mx-auto text-white font-sans border border-[1px] border-solid border-[#2D2F31]">
      <h2 className="text-center mb-6 text-2xl font-semibold">How this works?</h2>
      <ul className="list-none relative space-y-6">
        <li className="relative pl-10">
          {/* The dashed line */}
          <div className="absolute top-0 left-3 bottom-0 border-l-2 border-dashed border-gray-600" />
          {/* The circle bullet */}
          <span className="absolute top-0 left-2 w-3 h-3 bg-white rounded-full"></span>
          <strong>UPLOAD .EML FILE</strong>
          <ul className="mt-2 ml-6 text-gray-400">
            <li>— Download .eml from your email client</li>
            <li>— Upload the file to edit mail</li>
          </ul>
        </li>

        <li className="relative pl-10">
          <div className="absolute top-0 left-3 bottom-0 border-l-2 border-dashed border-gray-600" />
          <span className="absolute top-0 left-2 w-3 h-3 bg-white rounded-full"></span>
          <strong>SELECT TEXT TO HIDE</strong>
          <ul className="mt-2 ml-6 text-gray-400">
            <li>— Use our eraser to hide any content</li>
            <li>— Select multiple parts if needed</li>
          </ul>
        </li>

        <li className="relative pl-10">
          <div className="absolute top-0 left-3 bottom-0 border-l-2 border-dashed border-gray-600" />
          <span className="absolute top-0 left-2 w-3 h-3 bg-white rounded-full"></span>
          <strong>RECLICK TO SHOW AGAIN</strong>
          <ul className="mt-2 ml-6 text-gray-400">
            <li>— Click on any erased part to show again</li>
            <li>— Repeat it until satisfied</li>
          </ul>
        </li>

        <li className="relative pl-10">
          <div className="absolute top-0 left-3 bottom-0 border-l-2 border-dashed border-gray-600" />
          <span className="absolute top-0 left-2 w-3 h-3 bg-white rounded-full"></span>
          <strong>GENERATE PROOF</strong>
          <ul className="mt-2 ml-6 text-gray-400">
            <li>— Generate proof for the masked mail</li>
            <li>— Wait a few minutes for generation</li>
          </ul>
        </li>

        <li className="relative pl-10">
          <div className="absolute top-0 left-3 bottom-0 border-l-2 border-dashed border-gray-600" />
          <span className="absolute top-0 left-2 w-3 h-3 bg-white rounded-full"></span>
          <strong>DOWNLOAD MAIL</strong>
          <ul className="mt-2 ml-6 text-gray-400">
            <li>— Download mail with hidden contents</li>
          </ul>
        </li>

        <li className="relative pl-10">
          <div className="absolute top-0 left-3 bottom-0 border-l-2 border-dashed border-gray-600" />
          <span className="absolute top-0 left-2 w-3 h-3 bg-white rounded-full"></span>
          <strong>SHARE VERIFICATION LINK</strong>
          <ul className="mt-2 ml-6 text-gray-400">
            <li>— Proves the authenticity of the mail</li>
            <li>— Anyone can verify through this link</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Steps;

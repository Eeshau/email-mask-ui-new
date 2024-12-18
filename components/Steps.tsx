import React from "react";

const Steps: React.FC = () => {
  return (
    <div className="p-6 bg-[#161819] w-full h-full rounded-[10px] mx-auto text-white font-sans border border-[0.5px] border-solid border-[#2D2F31]">
      <h2 className="text-center mb-6 mx-auto text-lg font-medium border-b border-gray-700 pb-3">
        How this works?
      </h2>
      <ul className="list-none max-w-md relative space-y-6 mx-auto">
        {/* Step 1 */}
        <li className="relative pl-10">
          {/* Dashed line extended to overlap the spacing */}
          <div
            className="absolute top-0 left-[13px] bottom-0 border-l-2 border-dashed border-gray-700"
            style={{ bottom: "-1.5rem" }}
          />
          {/* Circle bullet */}
          <span className="absolute top-0 left-2 w-3 h-3 bg-[#F5F3EF] rounded-full"></span>
          <p>UPLOAD .EML FILE</p>
          <ul className="mt-2 ml-6 text-gray-400">
            <li>— Download .eml from your email client</li>
            <li>— Upload the file to edit mail</li>
          </ul>
        </li>

        {/* Step 2 */}
        <li className="relative pl-10">
          <div
            className="absolute top-0 left-[13px] bottom-0 border-l-2 border-dashed border-gray-700"
            style={{ bottom: "-1.5rem" }}
          />
          <span className="absolute top-0 left-2 w-3 h-3 bg-[#F5F3EF] rounded-full"></span>
          <p>SELECT TEXT TO HIDE</p>
          <ul className="mt-2 ml-6 text-gray-400">
            <li>— Use our eraser to hide any content</li>
            <li>— Select multiple parts if needed</li>
          </ul>
        </li>

        {/* Step 3 */}
        <li className="relative pl-10">
          <div
            className="absolute top-0 left-[13px] bottom-0 border-l-2 border-dashed border-gray-700"
            style={{ bottom: "-1.5rem" }}
          />
          <span className="absolute top-0 left-2 w-3 h-3 bg-[#F5F3EF] rounded-full"></span>
          <p>REHIGHLIGHT TO SHOW AGAIN</p>
          <ul className="mt-2 ml-6 text-gray-400">
            <li>— Click on any erased part to show again</li>
            <li>— Repeat it until satisfied</li>
          </ul>
        </li>

        {/* Step 4 */}
        <li className="relative pl-10">
          <div
            className="absolute top-0 left-[13px] bottom-0 border-l-2 border-dashed border-gray-700"
            style={{ bottom: "-1.5rem" }}
          />
          <span className="absolute top-0 left-2 w-3 h-3 bg-[#F5F3EF] rounded-full"></span>
          <p>GENERATE PROOF</p>
          <ul className="mt-2 ml-6 text-gray-400">
            <li>— Generate proof for the masked mail</li>
            <li>— Wait a few minutes for generation</li>
          </ul>
        </li>

        {/* Step 5 */}
        <li className="relative pl-10">
          <div
            className="absolute top-0 left-[13px] bottom-0 border-l-2 border-dashed border-gray-700"
            style={{ bottom: "-1.5rem" }}
          />
          <span className="absolute top-0 left-2 w-3 h-3 bg-[#F5F3EF] rounded-full"></span>
          <p>DOWNLOAD MAIL</p>
          <ul className="mt-2 ml-6 text-gray-400">
            <li>— Download mail with hidden contents</li>
          </ul>
        </li>

        {/* Step 6 (Last Step) */}
        <li className="relative pl-10">
          <span className="absolute top-0 left-2 w-3 h-3 bg-[#F5F3EF] rounded-full"></span>
          <p>SHARE VERIFICATION LINK</p>
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

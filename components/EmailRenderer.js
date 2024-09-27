import React, { useState, useEffect } from "react";
import PostalMime from "postal-mime";
import crypto from "crypto-browserify";
import { styles } from "./styles";

import Steps from "./Steps";
import NavBar from "./NavBar";

// Helper function to escape special regex characters in the text
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex characters
};

const EmailRenderer = () => {
  const [emailBody, setEmailBody] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fromEmail, setFromEmail] = useState(""); // Store the From email address
  const [toEmail, setToEmail] = useState(""); // Store the To email address
  const [subject, setSubject] = useState(""); // Store the Subject
  const [bhContent, setBhContent] = useState("");
  // const [bhValue, setBhValue] = useState("");
  const [highlightEnabled, setHighlightEnabled] = useState(false);
  const [highlightedTextMeta, setHighlightedTextMeta] = useState([]); // For meta fields
  const [highlightedTextBody, setHighlightedTextBody] = useState([]); // For body content
  const [showEMLPreview, setShowEMLPreview] = useState(false); // Toggle between raw EML and preview

  // States for hiding "From", "To", and "Subject"
  const [hideFrom, setHideFrom] = useState(false);
  const [hideTo, setHideTo] = useState(false);
  const [hideSubject, setHideSubject] = useState(false);


  const [activeSection, setActiveSection] = useState("change");

  const handleCompareChanges = () => {
    setActiveSection("compare");
    console.log("Compare Changes Selected");
  };

  const handleResetChanges = () => {
    setActiveSection("reset");

    setHighlightedTextMeta([]); // Clear highlighted meta text
    setHighlightedTextBody([]); // Clear highlighted body text
    setHideFrom(false)
    setHideTo(false)
    setHideSubject(false)

    // setActiveSection("change");
  };

  const handleChangeEmail = () => {
    setActiveSection("change");
    console.log("Change Email Selected");
  };

  const handleViewSteps = () => {
    setActiveSection("steps");
    console.log("View Steps Selected");
  };

  // Update highlightedTextMeta when hide toggles change
  useEffect(() => {
    const updatedMetaHighlights = new Set([...highlightedTextMeta]);
  
    // Add or remove "From" email based on checkbox
    if (hideFrom) {
      updatedMetaHighlights.add(fromEmail);
    } else {
      updatedMetaHighlights.delete(fromEmail);
    }
  
    // Add or remove "To" email based on checkbox
    if (hideTo) {
      updatedMetaHighlights.add(toEmail);
    } else {
      updatedMetaHighlights.delete(toEmail);
    }
  
    // Add or remove "Subject" based on checkbox
    if (hideSubject) {
      updatedMetaHighlights.add(subject);
    } else {
      updatedMetaHighlights.delete(subject);
    }
  
    setHighlightedTextMeta([...updatedMetaHighlights]);
  }, [hideFrom, hideTo, hideSubject, fromEmail, toEmail, subject]);
  


  // Handle selection for meta and body text separately, checks wether the user is hihglighting the body or the meta (to,from, subject of the email)
  // check this seperatly because one should be text(the meta) and the other might be html content(the body)
useEffect(() => {
  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
      const selectedText = selection.toString().trim();

      // Check if selection is from the email body or meta fields
      const selectedElement = selection.anchorNode?.parentElement;

      if (selectedElement?.closest('.email-body-container')) {
        // Add to body highlights if selection is from the email body
        setHighlightedTextBody((prev) => [...prev, selectedText]);
        console.log("Highlighted in Body: ", selectedText); // Debugging
      } else {
        // Otherwise, add to meta highlights
        setHighlightedTextMeta((prev) => [...prev, selectedText]);
        console.log("Highlighted in Meta: ", selectedText); // Debugging
      }
    }
  };

  if (highlightEnabled) {
    document.addEventListener("mouseup", handleSelection);
  } else {
    document.removeEventListener("mouseup", handleSelection);
  }

  return () => {
    document.removeEventListener("mouseup", handleSelection);
  };
}, [highlightEnabled]);


  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result;
        setFileContent(content);
        await parseEml(content);
        extractBhValue(content);
      };
      reader.readAsText(file);
    }
  };

  const handleTextAreaChange = async (e) => {
    if (!e.target.value) {
      setFileContent("");
      return;
    }
    const content = e.target.value;
    setFileContent(content);
    await parseEml(content);
    extractBhValue(content);
  };

  const parseEml = async (emlContent) => {
    const parser = new PostalMime();
    let parsedEmail;

    try {
      parsedEmail = await parser.parse(emlContent);

      const from = parsedEmail?.from?.value?.[0]?.address;
      const to = parsedEmail?.to?.value?.[0]?.address;
      const subject = parsedEmail?.subject;

      if (!from || !to || !subject) {
        const fromMatch = emlContent.match(/^From:\s.*<([^>]+)>/m);
        const toMatch = emlContent.match(/^To:\s.*<([^>]+)>/m);
        const subjectMatch = emlContent.match(/^Subject:\s*(.*)/m);

        setFromEmail(fromMatch ? fromMatch[1] : 'Unknown');
        setToEmail(toMatch ? toMatch[1] : 'Unknown');
        setSubject(subjectMatch ? subjectMatch[1] : 'Unknown');
      } else {
        setFromEmail(from || 'Unknown');
        setToEmail(to || 'Unknown');
        setSubject(subject || 'Unknown');
      }

      setEmailBody(parsedEmail.html || parsedEmail.text || "No body content found");

    } catch (error) {
      console.error("Error parsing EML file with PostalMime:", error);

      const fromMatch = emlContent.match(/^From:\s.*<([^>]+)>/m);
      const toMatch = emlContent.match(/^To:\s.*<([^>]+)>/m);
      const subjectMatch = emlContent.match(/^Subject:\s*(.*)/m);

      setFromEmail(fromMatch ? fromMatch[1] : 'Unknown');
      setToEmail(toMatch ? toMatch[1] : 'Unknown');
      setSubject(subjectMatch ? subjectMatch[1] : 'Unknown');
    }
  };

  const extractBhValue = (emlContent) => {
    const bhRegex = /bh=([^;]+)/;
    const match = emlContent.match(bhRegex);
    if (match) {
      const bh = match[1];
      setBhValue(bh);
      calculateBhContent(emlContent, bh);
    } else {
      setBhContent("bh value not found");
    }
  };

  const calculateBhContent = (emlContent, bh) => {
    const bodyContent = extractBodyContent(emlContent);
    if (bodyContent) {
      const normalizedContent = normalizeBodyContent(bodyContent);
      const hash = crypto
        .createHash("sha256")
        .update(normalizedContent)
        .digest("base64");
      setBhContent(hash === bh ? normalizedContent : `Hash value: ${hash}`);
    } else {
      setBhContent("Body content not found");
    }
  };

  const extractBodyContent = (emlContent) => {
    const bodyRegex = /\r?\n\r?\n([\s\S]*)/;
    const match = emlContent.match(bodyRegex);
    return match ? match[1] : null;
  };

  const normalizeBodyContent = (bodyContent) => {
    const trimmedContent = bodyContent.replace(/\s+$/, "");
    const crlfContent = trimmedContent.replace(/\r?\n/g, "\r\n");
    const normalizedContent = crlfContent.replace(/(\r\n)*$/, "\r\n");
    return normalizedContent;
  };

  // Filter and sanitize highlightedText to avoid empty or invalid strings
  const getValidHighlightedText = (highlightArray) => {
    return highlightArray.filter(
      (text) => typeof text === 'string' && text.trim().length > 0
    );
  };

  const getHighlightedContent = (content, highlightArray) => {
    const validHighlightedText = getValidHighlightedText(highlightArray);
    if (validHighlightedText.length === 0) return content;

    const escapedText = validHighlightedText.map(escapeRegExp);
    const combinedRegex = new RegExp(`(${escapedText.join('|')})`, 'gi');

    return content.split(combinedRegex).map((part, index) =>
      combinedRegex.test(part) ? (
        <span className="highlight" key={`highlight-${index}`}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };



  const getHighlightedContentHTML = (content) => {
    
    if (highlightedTextBody.length === 0) return content;

    let highlightedContent = content;

    highlightedTextBody.forEach((text) => {
      // Match the highlighted text only if it's not inside HTML tags
      const regex = new RegExp(`(?!<[^>]*?)(${text})(?![^<]*?>)`, "gi");
      highlightedContent = highlightedContent.replace(
        regex,
        '<span class="highlightBody">$1</span>'
      );
    });

    return highlightedContent;
  };




  return (
    <div style={styles.container}>

    <NavBar
        onCompareChanges={handleCompareChanges}
        onResetChanges={handleResetChanges}
        onChangeEmail={handleChangeEmail}
        onViewSteps={handleViewSteps}
        activeSection={activeSection}
    />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "3rem 5rem",
          minWidth: "70vw",
          gap: "1rem",
          alignItems: "center",
        }}
        className="font-sans"
      >

        { activeSection === 'change' && (
        <div>
        <div class="file-input-container">
          <label htmlFor="file-upload" class="file-input-label">
            Choose a file
          </label>
          <input
            id="file-upload"
            class="file-input"
            type="file"
            accept=".eml"
            onChange={handleFileUpload}
          />
        </div>
        

        <textarea
          value={fileContent}
          onChange={handleTextAreaChange}
          rows={5}
          placeholder="Or paste .eml content here"
          className="textarea-floating"
        />
        </div>
      )}
      </div>

      <div className="grid grid-cols-6 gap-1 w-full font-sans"> 
        {/* MASKED EMAIL SECTION */}
        <div className={`${activeSection === 'compare' ? 'col-span-3' : activeSection === 'change' ? 'col-span-6' : activeSection === 'steps' ? 'col-span-4' : activeSection === 'reset' ? 'col-span-6' : ''}`}>
        {/* Display From, To, and Subject fields */}
        {fileContent && (
          <div className="bg-[#141517] text-white rounded-lg p-6" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
            <h1 className="text-4xl text-center">Masked Email</h1>

            <div className="flex justify-between items-center border-b border-gray-700 py-2">
              <div className="flex">
                <label className="w-[80px]">From:</label>
                <div style={styles.input}>
                  {getHighlightedContent(fromEmail, highlightedTextMeta)}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  checked={hideFrom}
                  onChange={() => setHideFrom(!hideFrom)}
                />
                <p className="text-gray font-sans">Hide all</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-700 py-2">
              <div className="flex">
                <label className="w-[80px]">To:</label>    
                <div style={styles.input}>
                  {getHighlightedContent(toEmail, highlightedTextMeta)}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  checked={hideTo}
                  onChange={() => setHideTo(!hideTo)}
                />
                <p className="text-gray font-sans">Hide all</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-700 py-2">
              <div className="flex">
                <label className="w-[80px]">Subject:</label>
                <div style={styles.input}>
                  {getHighlightedContent(subject, highlightedTextMeta)}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  checked={hideSubject}
                  onChange={() => setHideSubject(!hideSubject)}
                />
                <p className="text-gray font-sans">Hide all</p>
              </div>
            </div>
            <div>
              <label>Body:</label>
            </div>
          </div>
        )}

      {fileContent ? (
        <div
        style={{
          position: "fixed",  // Change from 'absolute' to 'fixed' to make the buttons sticky
          bottom: "20px",     // Keep them 20px from the bottom of the viewport
          left: "50%",        
          transform: "translateX(-50%)", 
          display: "flex",
          flexDirection: "row",
          alignItems: "center",  // Align items vertically in the center
          gap: "1rem",
          zIndex: 1000,      
          backgroundColor: "#26272E",
          padding: "10px",  
          borderRadius: "12px", 
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"  
        }}
      >
        <button
          onClick={() => setHighlightEnabled(!highlightEnabled)}
          className="button font-sans flex items-center"
        >
            <span className="mr-2">
            {/* Replace this with your SVG code */}
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="24" viewBox="0 0 48 24" fill="none">
              <rect width="48" height="24" rx="12" fill={highlightEnabled ? "#26A544" : "#300000"} />
              <circle cx={highlightEnabled ? "35" : "13"} cy="12" r="9" fill="#D9D9D9"/>
            </svg>
          </span>
          {highlightEnabled ? "Disable Highlighter" : "Enable Highlighter"}
        </button>

        {/* Divider */}
        <div
          style={{
            height: "24px",       // Adjust height of the divider as needed
            width: "1px",
            backgroundColor: "#444",  // Divider color
          }}
        ></div>

        <button
          onClick={() => setShowEMLPreview(!showEMLPreview)}
          className="button font-sans"
        >
          {showEMLPreview ? "Switch to Raw EML" : "Switch to EML Preview"}
        </button>
      </div>

      ) : null}


        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "50vh",
            margin: "1rem",
          }}
        >
          {showEMLPreview && bhContent ? (
            <div style={styles.rawContent}>
              <h2>Content used for bh</h2>

              <pre>{getHighlightedContent(bhContent, highlightedTextBody)}</pre>
            </div>
          ) : (
            <div
              style={styles.emailbody}
              dangerouslySetInnerHTML={{
                __html: getHighlightedContentHTML(emailBody),
              }}
              className="email-body-container"
            />
          )}
        </div>
      </div>

      {/* ORIGINAL EMAIL SECTION */}

      { activeSection === 'compare' &&  (
      <div className="col-span-3">
        {fileContent && (
          <div className="bg-[#141517] text-white rounded-lg p-6" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
            <h1 className="text-4xl text-center">Original Email</h1>
            <div className="flex justify-between items-center border-b border-gray-700 py-2">
              <div className="flex">
              <label className="w-[80px]">From:</label>
              <div style={styles.input}>
                {fromEmail}
              </div>
              </div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 py-2">
              <div className="flex">
                <label className="w-[80px]">To:</label>
                <div style={styles.input}>
                  {toEmail}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 py-2">
              <div className="flex">
                <label className="w-[80px]">Subject:</label>
                <div style={styles.input}>
                  {subject}
                </div>
              </div>
            </div>
            <div>
              <label>Body:</label>
            </div>
          </div>
        )}

        {/* Original Body Content without highlights */}
        <div
          style={styles.emailBody}
          dangerouslySetInnerHTML={{
            __html: emailBody,
          }}
          className="email-body-container"
        />
        
      </div>
      )}
      

      { activeSection === 'steps' ?  <div className="col-span-2"> <Steps/> </div>: null }
      </div>
      


      
  
    </div>
  );
};

export default EmailRenderer;

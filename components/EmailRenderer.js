import React, { useState, useEffect, useContext } from "react";
import PostalMime from "postal-mime";
// import crypto from "crypto-browserify";
import { styles } from "./styles";

import Steps from "./Steps";
import NavBar from "./NavBar";

import { FileContext } from '../app/FileContext';

// Helper function to escape special regex characters in the text
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex characters
};

const EmailRenderer = () => {
  // States for actual email content
  const [emailBody, setEmailBody] = useState("");
  const { fileContent, setFileContent } = useContext(FileContext);

  const [fromEmail, setFromEmail] = useState(""); // Store the From email address
  const [toEmail, setToEmail] = useState(""); // Store the To email address
  const [subject, setSubject] = useState(""); // Store the Subject
  const [bhContent, setBhContent] = useState("");
  const [bhValue, setBhValue] = useState("");

  // States for content that's been redacted
  const [highlightedTextMeta, setHighlightedTextMeta] = useState([]); // For meta fields
  const [highlightedTextBody, setHighlightedTextBody] = useState([]); // For body content

  // States for toggle bar
  const [highlightEnabled, setHighlightEnabled] = useState(false);
  const [showEMLPreview, setShowEMLPreview] = useState(false); // Toggle between raw EML and preview
  const [postProofGeneration, setPostProofGeneration] = useState(false); // determines wether proof is generated and show the user Download Mail or Copy verification link

  // States for hiding "From", "To", and "Subject"
  const [hideFrom, setHideFrom] = useState(false);
  const [hideTo, setHideTo] = useState(false);
  const [hideSubject, setHideSubject] = useState(false);

  // State for copy verification link & Download Mail
  const [linkCopied, setLinkCopied] = useState(false);
  const [downloadedMail, setDownloadedMail] = useState(false);


  // States for the active section in the top right menu, determines what step to show on screen
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
  




  // Update highlightedTextMeta when "hide from, to, subject, body, etc" checkbox toggles change
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
  


  // Handle selection for meta and body text separately, checks wether the user is highlighting the body or the meta (to,from, subject of the email)
  // need to check this seperatly when creating the proof because one should be text(the meta) and the other might be html content(the body)
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
        const selectedText = selection.toString().trim();
  
        // Check if selection is from the email body or meta fields
        const selectedElement = selection.anchorNode?.parentElement;
  
        if (selectedElement?.closest('.email-body-container')) {
          // Toggle body highlights
          setHighlightedTextBody((prev) => {
            if (prev.includes(selectedText)) {
              // Remove selectedText from highlightedTextBody
              return prev.filter((text) => text !== selectedText);
            } else {
              // Add selectedText to highlightedTextBody
              return [...prev, selectedText];
            }
          });
          console.log("Selected in Body: ", selectedText);
        } else {
          // Toggle meta highlights
          setHighlightedTextMeta((prev) => {
            if (prev.includes(selectedText)) {
              // Remove selectedText from highlightedTextMeta
              return prev.filter((text) => text !== selectedText);
            } else {
              // Add selectedText to highlightedTextMeta
              return [...prev, selectedText];
            }
          });
          console.log("Selected in Meta: ", selectedText);
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

    // Parse the EML content when fileContent changes
    useEffect(() => {
      if (fileContent) {
        parseEml(fileContent);
        extractBhValue(fileContent);
      }
    }, [fileContent]);

  const extractBhValue = (emlContent) => {
    const bhRegex = /bh=([^;]+)/;
    const match = emlContent.match(bhRegex);
    if (match) {
      const bh = match[1];
      setBhValue(bh);
      calculateBhContent(emlContent, bh);
      console.log(bhValue)
    } else {
      setBhContent("bh value not found");
    }
  };


  //SKIPPED OVER THE LOGIC TO GET A HASH, AND JUST SHOWED THE FULL RAW EML, UNCOMMENT FOR HASHED META AND ONLY BODY VERSION  
  const calculateBhContent = (emlContent) => {
    // const bodyContent = extractBodyContent(emlContent);
    console.log('EML CONTENT: ',emlContent)
    // if (bodyContent) {
    //   const normalizedContent = normalizeBodyContent(bodyContent);
    //   const hash = crypto
    //     .createHash("sha256")
    //     .update(normalizedContent)
    //     .digest("base64");
    //   setBhContent(hash === bh ? normalizedContent : `Hash value: ${hash}`);
      setBhContent( emlContent);

    // } else {
    //   setBhContent("Body content not found");
    // }
  };

  // const extractBodyContent = (emlContent) => {
  //   const bodyRegex = /\r?\n\r?\n([\s\S]*)/;
  //   const match = emlContent.match(bodyRegex);

  //   return match ? match[1] : null;
  // };

  // const normalizeBodyContent = (bodyContent) => {
  //   const trimmedContent = bodyContent.replace(/\s+$/, "");
  //   const crlfContent = trimmedContent.replace(/\r?\n/g, "\r\n");
  //   const normalizedContent = crlfContent.replace(/(\r\n)*$/, "\r\n");
  //   console.log('NORMALIZED CONTENT: ',normalizedContent)
  //   return normalizedContent;
  // };

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


  // Copy Verifcation Link to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('replace with verification link to be copied to users clipboard');
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);  // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Download Mail 
  const handleDownload = () => {
    //need to add logic for this
    setDownloadedMail(true);
    setTimeout(() => setDownloadedMail(false), 2000);  // Reset after 2 seconds
  };



  return (
    <div className="p-[20px]">

    <NavBar
        mode='prove'
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
          margin: "1rem",
          minWidth: "70vw",
          gap: "1rem",
          alignItems: "center",
        }}
        className="font-sans"
      >

        { activeSection === 'change' && (
        <div>
          <label className="text-white text-lg sm:text-xl">
            Your .eml content
          </label>

          <textarea
            value={fileContent}
            onChange={handleTextAreaChange}
            rows={5}
            placeholder="Paste your .eml content here or upload below"
            className="textarea-floating px-[20px] py-[10px] mt-[10px] text-[10px] sm:text-[14px]"
          />

          <div class="file-input-container">
            <label htmlFor="file-upload" className="file-input-label text-[10px] sm:text-[14px]">
              Choose a file
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" viewBox="0 0 16 16" fill="none">
                <path d="M13.3538 5.14625L9.85375 1.64625C9.80728 1.59983 9.75212 1.56303 9.69143 1.53793C9.63073 1.51284 9.56568 1.49995 9.5 1.5H3.5C3.23478 1.5 2.98043 1.60536 2.79289 1.79289C2.60536 1.98043 2.5 2.23478 2.5 2.5V13.5C2.5 13.7652 2.60536 14.0196 2.79289 14.2071C2.98043 14.3946 3.23478 14.5 3.5 14.5H12.5C12.7652 14.5 13.0196 14.3946 13.2071 14.2071C13.3946 14.0196 13.5 13.7652 13.5 13.5V5.5C13.5001 5.43432 13.4872 5.36927 13.4621 5.30858C13.437 5.24788 13.4002 5.19272 13.3538 5.14625ZM10 3.20688L11.7931 5H10V3.20688ZM12.5 13.5H3.5V2.5H9V5.5C9 5.63261 9.05268 5.75979 9.14645 5.85355C9.24021 5.94732 9.36739 6 9.5 6H12.5V13.5ZM9.85375 8.64625C9.90021 8.6927 9.93706 8.74786 9.9622 8.80855C9.98734 8.86925 10.0003 8.9343 10.0003 9C10.0003 9.0657 9.98734 9.13075 9.9622 9.19145C9.93706 9.25214 9.90021 9.3073 9.85375 9.35375C9.8073 9.40021 9.75214 9.43706 9.69145 9.4622C9.63075 9.48734 9.5657 9.50028 9.5 9.50028C9.4343 9.50028 9.36925 9.48734 9.30855 9.4622C9.24786 9.43706 9.1927 9.40021 9.14625 9.35375L8.5 8.70687V11.5C8.5 11.6326 8.44732 11.7598 8.35355 11.8536C8.25979 11.9473 8.13261 12 8 12C7.86739 12 7.74021 11.9473 7.64645 11.8536C7.55268 11.7598 7.5 11.6326 7.5 11.5V8.70687L6.85375 9.35375C6.8073 9.40021 6.75214 9.43706 6.69145 9.4622C6.63075 9.48734 6.5657 9.50028 6.5 9.50028C6.4343 9.50028 6.36925 9.48734 6.30855 9.4622C6.24786 9.43706 6.1927 9.40021 6.14625 9.35375C6.09979 9.3073 6.06294 9.25214 6.0378 9.19145C6.01266 9.13075 5.99972 9.0657 5.99972 9C5.99972 8.9343 6.01266 8.86925 6.0378 8.80855C6.06294 8.74786 6.09979 8.6927 6.14625 8.64625L7.64625 7.14625C7.69269 7.09976 7.74783 7.06288 7.80853 7.03772C7.86923 7.01256 7.93429 6.99961 8 6.99961C8.06571 6.99961 8.13077 7.01256 8.19147 7.03772C8.25217 7.06288 8.30731 7.09976 8.35375 7.14625L9.85375 8.64625Z" fill="#161819"/>
              </svg>
            </label>

            <input
              id="file-upload"
              class="file-input"
              type="file"
              accept=".eml"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      )}
      </div>

      <div className="grid grid-cols-6 gap-4 w-full font-sans "> 
        {/* MASKED EMAIL SECTION */}
        <div className={ `text-[12px] sm:text-[14px] border border-[0.5px] border-solid border-[#3B3B3B] bg-[#161819] rounded-[12px]  ${activeSection === 'compare' ? 'col-span-6 sm:col-span-3' : activeSection === 'change' ? 'col-span-6' : activeSection === 'steps' ? 'col-span-6 sm:col-span-4' : activeSection === 'reset' ? 'col-span-6' : ''}`}>
        {/* Display From, To, and Subject fields */}
        {fileContent && (
          <div className=" text-white p-6" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
            {activeSection == "compare" ? <h1 className="text-xl text-center">Masked Email</h1> : null}

            <div className="flex justify-between items-center border-b border-gray-700 py-2">
              <div className="flex flex-1 overflow-hidden">
                <label className="w-[60px] sm:w-[80px] flex-shrink-0">From:</label>
                <div
                  style={styles.input}
                  className="overflow-x-auto whitespace-nowrap"
                >
                  {getHighlightedContent(fromEmail, highlightedTextMeta)}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={hideFrom}
                  onChange={() => setHideFrom(!hideFrom)}
                />
                <p className="text-gray font-sans">Hide all</p>
              </div>
            </div>


            <div className="flex justify-between items-center border-b border-gray-700 py-2">
              <div className="flex flex-1 overflow-hidden">
                <label className="w-[60px] sm:w-[80px] flex-shrink-0">To:</label>    
                <div style={styles.input} className="overflow-x-auto whitespace-nowrap">
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
              <div className="flex flex-1 overflow-hidden">
                <label className="w-[60px] sm:w-[80px] flex-shrink-0">Subject:</label>
                <div style={styles.input} className="overflow-x-auto whitespace-nowrap">
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


      {/* THE BUTTONS BAR FLOATING ON THE BOTTOM OF THE SCREEN*/}
      {fileContent ? (
        <div
        style={{
          position: "fixed",  
          bottom: "20px",    
          left: "50%",
          transform: "translateX(-50%)", 
          display: "flex",
          flexDirection: "row",
          alignItems: "center",  
          gap: "1rem",
          zIndex: 1000,      
          backgroundColor: "#26272E",
          padding: "5px",  
          border: "1px solid #2D2F31", 
          borderRadius: "12px", 
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",  
        }}
      >



        { postProofGeneration ? (
          <>
          <button
            onClick={handleDownload}
            className="button font-sans flex items-center whitespace-normal sm:whitespace-nowrap text-[9px] sm:text-[14px]"
          >
            <span className="mr-2">
            {downloadedMail ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="none">
                <path d="M17.4344 5.34531L16.1844 2.84531C16.1324 2.74148 16.0526 2.65417 15.9538 2.59317C15.855 2.53218 15.7411 2.49992 15.625 2.5H4.375C4.25889 2.49992 4.14505 2.53218 4.04625 2.59317C3.94744 2.65417 3.86759 2.74148 3.81562 2.84531L2.56563 5.34531C2.52254 5.43226 2.50009 5.52797 2.5 5.625V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V5.625C17.4999 5.52797 17.4775 5.43226 17.4344 5.34531ZM4.76094 3.75H15.2391L15.8641 5H4.13594L4.76094 3.75ZM16.25 16.25H3.75V6.25H16.25V16.25ZM12.9422 11.4328C13.0003 11.4909 13.0464 11.5598 13.0779 11.6357C13.1093 11.7115 13.1255 11.7929 13.1255 11.875C13.1255 11.9571 13.1093 12.0385 13.0779 12.1143C13.0464 12.1902 13.0003 12.2591 12.9422 12.3172L10.4422 14.8172C10.3841 14.8753 10.3152 14.9214 10.2393 14.9529C10.1635 14.9843 10.0821 15.0005 10 15.0005C9.91787 15.0005 9.83654 14.9843 9.76066 14.9529C9.68479 14.9214 9.61586 14.8753 9.55781 14.8172L7.05781 12.3172C6.94054 12.1999 6.87465 12.0409 6.87465 11.875C6.87465 11.7091 6.94054 11.5501 7.05781 11.4328C7.17509 11.3155 7.33415 11.2497 7.5 11.2497C7.66585 11.2497 7.82491 11.3155 7.94219 11.4328L9.375 12.8664V8.125C9.375 7.95924 9.44085 7.80027 9.55806 7.68306C9.67527 7.56585 9.83424 7.5 10 7.5C10.1658 7.5 10.3247 7.56585 10.4419 7.68306C10.5592 7.80027 10.625 7.95924 10.625 8.125V12.8664L12.0578 11.4328C12.1159 11.3747 12.1848 11.3286 12.2607 11.2971C12.3365 11.2657 12.4179 11.2495 12.5 11.2495C12.5821 11.2495 12.6635 11.2657 12.7393 11.2971C12.8152 11.3286 12.8841 11.3747 12.9422 11.4328Z" fill="white"/>
              </svg>
            )}
            </span>
            {downloadedMail ? 'Mail Downloaded!' : 'Download Mail'}
          </button>
          {/* Divider */}
          <div
          style={{
            height: "24px",       // Adjust height of the divider as needed
            width: "1px",
            backgroundColor: "#444",  // Divider color
          }}
          />
          <button
            onClick={handleCopy}
            className="button font-sans flex items-center whitespace-normal sm:whitespace-nowrap text-[9px] sm:text-[14px]"
          >
            <span className="mr-2">
              {linkCopied ? 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              :
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="none">
                  <path d="M13.125 11.8749C13.125 12.0406 13.0592 12.1996 12.9419 12.3168C12.8247 12.434 12.6658 12.4999 12.5 12.4999H7.5C7.33424 12.4999 7.17527 12.434 7.05806 12.3168C6.94085 12.1996 6.875 12.0406 6.875 11.8749C6.875 11.7091 6.94085 11.5502 7.05806 11.4329C7.17527 11.3157 7.33424 11.2499 7.5 11.2499H12.5C12.6658 11.2499 12.8247 11.3157 12.9419 11.4329C13.0592 11.5502 13.125 11.7091 13.125 11.8749ZM12.5 8.74989H7.5C7.33424 8.74989 7.17527 8.81573 7.05806 8.93295C6.94085 9.05016 6.875 9.20913 6.875 9.37489C6.875 9.54065 6.94085 9.69962 7.05806 9.81683C7.17527 9.93404 7.33424 9.99989 7.5 9.99989H12.5C12.6658 9.99989 12.8247 9.93404 12.9419 9.81683C13.0592 9.69962 13.125 9.54065 13.125 9.37489C13.125 9.20913 13.0592 9.05016 12.9419 8.93295C12.8247 8.81573 12.6658 8.74989 12.5 8.74989ZM16.875 3.74989V16.8749C16.875 17.2064 16.7433 17.5243 16.5089 17.7588C16.2745 17.9932 15.9565 18.1249 15.625 18.1249H4.375C4.04348 18.1249 3.72554 17.9932 3.49112 17.7588C3.2567 17.5243 3.125 17.2064 3.125 16.8749V3.74989C3.125 3.41837 3.2567 3.10042 3.49112 2.866C3.72554 2.63158 4.04348 2.49989 4.375 2.49989H7.20781C7.55899 2.1067 7.98924 1.79212 8.47041 1.57673C8.95158 1.36134 9.47282 1.25 10 1.25C10.5272 1.25 11.0484 1.36134 11.5296 1.57673C12.0108 1.79212 12.441 2.1067 12.7922 2.49989H15.625C15.9565 2.49989 16.2745 2.63158 16.5089 2.866C16.7433 3.10042 16.875 3.41837 16.875 3.74989ZM7.5 4.99989H12.5C12.5 4.33685 12.2366 3.70096 11.7678 3.23212C11.2989 2.76328 10.663 2.49989 10 2.49989C9.33696 2.49989 8.70107 2.76328 8.23223 3.23212C7.76339 3.70096 7.5 4.33685 7.5 4.99989ZM15.625 3.74989H13.5352C13.6773 4.15131 13.75 4.57403 13.75 4.99989V5.62489C13.75 5.79065 13.6842 5.94962 13.5669 6.06683C13.4497 6.18404 13.2908 6.24989 13.125 6.24989H6.875C6.70924 6.24989 6.55027 6.18404 6.43306 6.06683C6.31585 5.94962 6.25 5.79065 6.25 5.62489V4.99989C6.25001 4.57403 6.32267 4.15131 6.46484 3.74989H4.375V16.8749H15.625V3.74989Z" fill="white"/>
                </svg> 
              }
            </span>
            {linkCopied ? 'Link Copied!' : 'Copy Verification Link'}
          </button>
          </>
        ) : (
        <> 
        <button
          onClick={() => setHighlightEnabled(!highlightEnabled)}
          className="button font-sans flex items-center whitespace-normal sm:whitespace-nowrap text-[9px] sm:text-[14px]"
        >
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-4 sm:w-6 sm:h-5 md:w-7 md:h-6" viewBox="0 0 48 24" fill="none">
              <rect width="48" height="24" rx="12" fill={highlightEnabled ? "#26A544" : "#300000"} />
              <circle cx={highlightEnabled ? "35" : "13"} cy="12" r="9" fill="#D9D9D9"/>
            </svg>
          </span>
          {highlightEnabled ? "Disable Eraser" : "Enable Eraser"}
        </button>

        {/* Divider */}
        <div
          style={{
            height: "24px",       // Adjust height of the divider as needed
            width: "1px",
            backgroundColor: "#444",  // Divider color
          }}
        />

        <button
          onClick={() => setShowEMLPreview(!showEMLPreview)}
          className="button font-sans whitespace-normal sm:whitespace-nowrap text-[9px] sm:text-[14px]"
        >
          {(showEMLPreview )? "Show EML Preview" : "Show Raw EML"}
        </button>

        {/* Divider */}
        <div
          style={{
            height: "24px",       // Adjust height of the divider as needed
            width: "1px",
            backgroundColor: "#444",  // Divider color
          }}
        />
          <button
            onClick={() => setPostProofGeneration(true)}
            className="button font-sans flex items-center whitespace-normal sm:whitespace-nowrap text-[9px] sm:text-[14px]"
          >
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg"     className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="none">
              <path d="M16.7854 14.0719C16.7431 14.1425 16.6873 14.204 16.6212 14.253C16.5551 14.302 16.48 14.3375 16.4001 14.3574C16.3203 14.3773 16.2373 14.3812 16.1559 14.3689C16.0746 14.3567 15.9964 14.3285 15.926 14.2859L10.6244 11.1039V16.875C10.6244 17.0408 10.5586 17.1997 10.4414 17.3169C10.3242 17.4342 10.1652 17.5 9.99943 17.5C9.83367 17.5 9.67469 17.4342 9.55748 17.3169C9.44027 17.1997 9.37443 17.0408 9.37443 16.875V11.1039L4.0713 14.2859C4.00089 14.3292 3.92261 14.3581 3.84097 14.3709C3.75934 14.3837 3.67597 14.3801 3.5957 14.3605C3.51543 14.3409 3.43985 14.3055 3.37334 14.2565C3.30682 14.2075 3.25068 14.1458 3.20817 14.0749C3.16567 14.004 3.13763 13.9255 3.1257 13.8437C3.11376 13.7619 3.11816 13.6786 3.13863 13.5985C3.1591 13.5185 3.19525 13.4433 3.24498 13.3773C3.2947 13.3113 3.35702 13.2558 3.42833 13.2141L8.78458 10L3.42833 6.78594C3.35702 6.74418 3.2947 6.6887 3.24498 6.62271C3.19525 6.55671 3.1591 6.48151 3.13863 6.40145C3.11816 6.3214 3.11376 6.23808 3.1257 6.15631C3.13763 6.07454 3.16567 5.99595 3.20817 5.92509C3.25068 5.85423 3.30682 5.7925 3.37334 5.74348C3.43985 5.69445 3.51543 5.6591 3.5957 5.63948C3.67597 5.61985 3.75934 5.61634 3.84097 5.62914C3.92261 5.64194 4.00089 5.67081 4.0713 5.71406L9.37443 8.89609V3.125C9.37443 2.95924 9.44027 2.80027 9.55748 2.68306C9.67469 2.56585 9.83367 2.5 9.99943 2.5C10.1652 2.5 10.3242 2.56585 10.4414 2.68306C10.5586 2.80027 10.6244 2.95924 10.6244 3.125V8.89609L15.9276 5.71406C15.998 5.67081 16.0762 5.64194 16.1579 5.62914C16.2395 5.61634 16.3229 5.61985 16.4031 5.63948C16.4834 5.6591 16.559 5.69445 16.6255 5.74348C16.692 5.7925 16.7482 5.85423 16.7907 5.92509C16.8332 5.99595 16.8612 6.07454 16.8732 6.15631C16.8851 6.23808 16.8807 6.3214 16.8602 6.40145C16.8397 6.48151 16.8036 6.55671 16.7539 6.62271C16.7041 6.6887 16.6418 6.74418 16.5705 6.78594L11.2143 10L16.5705 13.2141C16.641 13.2563 16.7024 13.3119 16.7514 13.3779C16.8003 13.4438 16.8358 13.5188 16.8557 13.5984C16.8757 13.6781 16.8797 13.7609 16.8677 13.8422C16.8556 13.9234 16.8276 14.0015 16.7854 14.0719Z" fill="white"/>
            </svg>
          </span>
          {postProofGeneration ? "Estimated Time: secs..." : "Generate Proof"}
          </button>
          </>
        )}
        

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
            <div style={styles.rawContent} className="text-white">
              <h2>Content used for bh</h2>

              <pre>{getHighlightedContent(bhContent, highlightedTextBody.concat(highlightedTextMeta))}</pre>
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
      <div className="text-[12px] sm:text-[14px] col-span-6 sm:col-span-3 border border-[0.5px] border-solid border-[#3B3B3B] bg-[#161819] rounded-[12px]">
        {fileContent && (
          <div className="text-white p-6" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
            <h1 className="text-xl text-center">Original Email</h1>
            <div className="flex justify-between items-center border-b border-gray-700 py-2">
              <div className="flex">
              <label className="w-[60px] sm:w-[80px]">From:</label>
              <div style={styles.input}>
                {fromEmail}
              </div>
              </div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 py-2">
              <div className="flex">
                <label className="w-[60px] sm:w-[80px]">To:</label>
                <div style={styles.input}>
                  {toEmail}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 py-2">
              <div className="flex">
                <label className="w-[60px] sm:w-[80px]">Subject:</label>
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

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "50vh",
            margin: "1rem",
          }}
        >
          {showEMLPreview && bhContent ? (
            <div style={styles.rawContent} className="text-white">
              <h2>Content used for bh</h2>

              <pre>{bhContent}</pre>
            </div>
          ) : (
            <div
            style={styles.emailbody}
            dangerouslySetInnerHTML={{
              __html: emailBody,
            }}
            className="email-body-container"
          />
          )}
        </div>
        
      </div>
      )}
      

      { activeSection === 'steps' ?  <div className="col-span-6 sm:col-span-2  order-first sm:order-2"> <Steps/> </div>: null }
      </div>
      


      
  
    </div>
  );
};

export default EmailRenderer;

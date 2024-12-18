'use client';
import React, { useState } from "react";
import NavBar from "../../components/NavBar";

// Define interfaces for your data structures
interface ProofData {
    headersLen?: number;
    bodyLen?: number;
    headersReveals?: { fromIndex: number; part: string }[];
    bodyReveals?: { fromIndex: number; part: string }[];
    dkimSignature?: { domain?: string; selector?: string };
}

interface ReconstructedContent {
    headers: string;
    body: string;
}

interface EmailSignature {
    domain: string;
    selector: string;
}

interface RevealedHidden {
    headers: string[];
    body: string[];
}

export default function Verify() {
    // Type your state variables
    const [proof, setProof] = useState<string>("");
    const [verified, setVerified] = useState<boolean>(false);
    const [reconstructedContent, setReconstructedContent] = useState<ReconstructedContent>({ headers: '', body: '' });
    const [emailSignature, setEmailSignature] = useState<EmailSignature>({ domain: "", selector: "" });

    // Function to analyze the proof
    const analyzeProofContent = (proof: string): { revealed: RevealedHidden; hidden: RevealedHidden; reconstructedContent: ReconstructedContent; emailSignature: EmailSignature } => {
        const proofData = JSON.parse(proof) as ProofData; // Assume proof is valid JSON

        const revealed: RevealedHidden = { headers: [], body: [] };
        const hidden: RevealedHidden = { headers: [], body: [] };

        const reconstructedContent: ReconstructedContent = { headers: '', body: '' };

        // Get headersLen and bodyLen
        const headersLen = proofData.headersLen ?? 0;
        const bodyLen = proofData.bodyLen ?? 0;

        // Initialize reconstructedBody and reconstructedHeaders with '█'
        const reconstructedBody = Array(bodyLen).fill('█');
        const reconstructedHeaders = Array(headersLen).fill('█');

        // Analyze revealed headers and body parts
        const headersReveals = proofData.headersReveals ?? [];
        const bodyReveals = proofData.bodyReveals ?? [];

        // Process body reveals
        for (const body of bodyReveals) {
            const fromIndex = body.fromIndex;
            const part = body.part;
            revealed.body.push(part);  // Extract 'part' property from each body object

            // Insert the revealed part into reconstructedBody
            for (let i = 0; i < part.length; i++) {
                if (fromIndex + i < bodyLen) {
                    reconstructedBody[fromIndex + i] = part.charAt(i);
                }
            }
        }

        // Process headers reveals
        for (const header of headersReveals) {
            const fromIndex = header.fromIndex;
            const part = header.part;
            revealed.headers.push(part);  // Extract 'part' property from each header object

            // Insert the revealed part into reconstructedHeaders
            for (let i = 0; i < part.length; i++) {
                if (fromIndex + i < headersLen) {
                    reconstructedHeaders[fromIndex + i] = part.charAt(i);
                }
            }
        }

        // For hidden headers, if no headers are revealed, perhaps we can note that
        const possibleHeaders = ["from", "to", "subject", "date", "reply-to", "message-id", "cc", "bcc"];
        const revealedHeadersSet = new Set(revealed.headers.map(h => h.split(":")[0]));

        // Identify hidden headers
        for (const header of possibleHeaders) {
            if (!revealedHeadersSet.has(header)) {
                hidden.headers.push(header);
            }
        }

        // Now, reconstructedBody is an array, we can join it into a string
        reconstructedContent.body = reconstructedBody.join('');

        // Similarly for headers
        reconstructedContent.headers = reconstructedHeaders.join('');

        // Extract email signature (domain and selector) from proofData
        const emailSignature: EmailSignature = {
            domain: proofData.dkimSignature?.domain ?? "",  // Fallback to empty string if domain not found
            selector: proofData.dkimSignature?.selector ?? "" // Fallback to empty string if selector not found
        };

        return { revealed, hidden, reconstructedContent, emailSignature };
    };

    const analyzeProof = () => {
        try {
            if (proof) {
                // Analyze the proof content and set the revealed and hidden parts
                const analysisResult = analyzeProofContent(proof);
                setReconstructedContent(analysisResult.reconstructedContent);
                setEmailSignature(analysisResult.emailSignature);

                // Simulate proof verification (replace with actual verification logic)
                setVerified(true);  // Assume proof is valid
            } else {
                setVerified(false);
                setReconstructedContent({ headers: '', body: '' });
                setEmailSignature({ domain: "", selector: "" });
            }
        } catch (error) {
            // Handle parsing errors or invalid proof format
            console.error("Error analyzing proof:", error);
            setVerified(false);
            setReconstructedContent({ headers: '', body: '' });
            setEmailSignature({ domain: "", selector: "" });
        }
    };

    return (
        <div className="p-[20px]">
          <NavBar activeSection='change' mode='verify'/>
          <div style={{ display: "flex", flexDirection: "column", margin: "1rem", minWidth: "70vw", gap: "1rem", alignItems: "center" }} className="font-sans">
            <h1 className="text-4xl text-white">Verify Email</h1>
            <label className="text-white text-md sm:text-lg text-left">
              Paste proof here
            </label>
      
            <textarea
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              rows={5}
              placeholder="Paste your proof here"
              className="textarea-floating px-[20px] py-[10px] mt-[10px] text-[10px] sm:text-[14px]"
            />
            <button className="buttonLight" style={{ alignSelf: "flex-start" }} onClick={analyzeProof}>Verify</button>
          </div> 
      
          {/* VERIFIED EMAIL PARTS */}
          {verified ? 
          <div className="border border-[0.5px] border-solid border-[#3B3B3B] bg-[#161819] rounded-[12px] p-6 text-white">
            <h3 className="">Verified email parts</h3>
            <div className="my-3">
              <h3>Proof: <span className={` ${verified ? 'text-[#5EC269]' : 'text-[#FF5F62]'}`}>{verified ? "Verified" : "Invalid"}</span></h3>
              <h3>Signed by &quot;{emailSignature.domain}&quot; with selector &quot;{emailSignature.selector}&quot;</h3>
            </div>
      
            <div className="border border-[0.5px] border-solid border-[#3B3B3B] bg-[#161819] my-3"/>
      
            {/* Metadata with reconstructed headers */}
            <h3 className="text-lg font-bold">Metadata</h3>
            <div className="p-2 text-white">
              <p style={{ wordBreak: 'break-word', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{reconstructedContent.headers}</p>
            </div>
      
            <div className="border border-[0.5px] border-solid border-[#3B3B3B] bg-[#161819] my-3"/>
      
            {/* Message with reconstructed body */}
            <h3 className="text-lg font-bold">Message</h3>
            <div className=" p-2 text-white">
              <p style={{ wordBreak: 'break-word', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{reconstructedContent.body}</p>
            </div>
          </div>
          : <></>}
      
          {/* HOW VERIFYING AN EMAIL WORKS STEPS */}
          <div className="my-20 px-[20px]">
            <h1 className="text-2xl text-white">How it works</h1>
            <ol className="text-white list-decimal list-inside">
              <li>Paste the proof in the input above and click &quot;Verify&quot;.</li>
              <li>The proof is verified in browser.</li>
              <li>Verified email domain and revealed email parts will be shown after verification.</li>
              <li>If the proof is invalid, you will see an error message.</li>
            </ol>
          </div>
        </div>
      );
}


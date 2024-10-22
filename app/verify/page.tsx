'use client'
import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import { styles } from "../.././components/styles";

export default function Verify() {
    const [proof, setProof] = useState("");
    const [verified, setVerified] = useState(false);
    const [revealedParts, setRevealedParts] = useState({ headers: [], body: [] });
    const [hiddenParts, setHiddenParts] = useState({ headers: [], body: [] });

    // Function to analyze the proof
    const analyzeProofContent = (proof) => {
        // Simulating proof data structure (replace this with actual proof parsing logic)
        const proofData = JSON.parse(proof); // Assume proof is valid JSON

        const revealed = { headers: [], body: [] };
        const hidden = { headers: [], body: [] };

        // Analyze revealed headers and body parts
        const headersReveals = proofData.headersReveals || [];
        const bodyReveals = proofData.bodyReveals || [];
        
        // Add revealed headers (assume each headerReveal has a 'part' property)
        for (let header of headersReveals) {
            revealed.headers.push(header.part);  // Extract 'part' property from each header object
        }

        // Add revealed body parts (assuming each bodyReveal is an object with a 'part' property)
        for (let body of bodyReveals) {
            revealed.body.push(body.part);  // Extract 'part' property from each body object
        }

        // Common headers we expect (can extend based on email structure)
        const possibleHeaders = ["from", "to", "subject", "date", "reply-to", "message-id", "cc", "bcc"];
        const revealedHeadersSet = new Set(revealed.headers.map(h => h.split(":")[0]));

        // Identify hidden headers
        for (let header of possibleHeaders) {
            if (!revealedHeadersSet.has(header)) {
                hidden.headers.push(header);
            }
        }

        // If no body parts revealed, assume entire body is hidden
        if (revealed.body.length === 0) {
            hidden.body.push("Entire body content is hidden.");
        }

        return { revealed, hidden };
    };

    const analyzeProof = () => {
        try {
            if (proof) {
                // Analyze the proof content and set the revealed and hidden parts
                const analysisResult = analyzeProofContent(proof);
                setRevealedParts(analysisResult.revealed);
                setHiddenParts(analysisResult.hidden);

                // Simulate proof verification (replace with actual verification logic)
                setVerified(true);  // Assume proof is valid
            } else {
                setVerified(false);
                setRevealedParts({ headers: [], body: [] });
                setHiddenParts({ headers: [], body: [] });
            }
        } catch (error) {
            // Handle parsing errors or invalid proof format
            console.error("Error analyzing proof:", error);
            setVerified(false);
            setRevealedParts({ headers: [], body: [] });
            setHiddenParts({ headers: [], body: [] });
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
                    placeholder="Paste your .eml content here or upload below"
                    className="textarea-floating px-[20px] py-[10px] mt-[10px] text-[10px] sm:text-[14px]"
                />
                <button className="buttonLight w-full" onClick={analyzeProof}>Verify</button>
            </div>

            {/* VERIFIED EMAIL PARTS */}
            <div className="border border-[0.5px] border-solid border-[#3B3B3B] bg-[#161819] rounded-[12px] p-6 text-white">
                <h3 className="">Verified email parts</h3>
                <div className="my-3">
                    <h3>Proof: <span className={` ${verified ? 'text-[#5EC269]' : 'text-[#FF5F62]'}`}>{verified ? "Verified" : "Invalid"}</span></h3>
                    <h3>Signed by "@icloud.com" with selector "1a1hai"</h3>
                </div>

                <div className="border border-[0.5px] border-solid border-[#3B3B3B] bg-[#161819] my-3"/>

                {/* Metadata with revealed/hidden elements */}
                <h3 className="text-lg font-bold">Metadata</h3>
                <div className="bg-white p-2 text-black">
                    <h4>Revealed Headers:</h4>
                    {revealedParts.headers.length > 0 ? (
                        <ul>
                            {revealedParts.headers.map((header, index) => (
                                <li key={index}>{header}</li>
                            ))}
                        </ul>
                    ) : <p>No revealed headers.</p>}

                    <h4>Hidden Headers:</h4>
                    {hiddenParts.headers.length > 0 ? (
                        <ul>
                            {hiddenParts.headers.map((header, index) => (
                                <li key={index}>{header}</li>
                            ))}
                        </ul>
                    ) : <p>No hidden headers.</p>}
                </div>

                <div className="border border-[0.5px] border-solid border-[#3B3B3B] bg-[#161819] my-3"/>

                {/* Message with revealed/hidden elements */}
                <h3 className="text-lg font-bold">Message</h3>
                <div className="bg-white p-2 text-black">
                    <h4>Revealed Body:</h4>
                    {revealedParts.body.length > 0 ? (
                        <ul>
                            {revealedParts.body.map((part, index) => (
                                <li key={index}>{part}</li>
                            ))}
                        </ul>
                    ) : <p>No revealed body content.</p>}

                    <h4>Hidden Body:</h4>
                    {hiddenParts.body.length > 0 ? (
                        <ul>
                            {hiddenParts.body.map((part, index) => (
                                <li key={index}>{part}</li>
                            ))}
                        </ul>
                    ) : <p>No hidden body content.</p>}
                </div>
            </div>

            {/* HOW VERIFYING AN EMAIL WORKS STEPS */}
            <div className="my-20">
                <h1 className="text-2xl text-white">How it works</h1>
                <ol className="text-white list-decimal list-inside">
                    <li>Paste the proof in the input above and click "Verify".</li>
                    <li>The proof is verified in browser.</li>
                    <li>Verified email domain and revealed email parts will be shown after verification.</li>
                    <li>If the proof is invalid, you will see an error message.</li>
                </ol>
            </div>
        </div>
    );
}

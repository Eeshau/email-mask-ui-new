'use client';
import React, { useState, useEffect } from "react";
import zkeSDK, { Blueprint, Proof, parseEmail, ExternalInputInput } from "@zk-email/sdk";

const TestZKEmail: React.FC = () => {
  const [emlFile, setEmlFile] = useState<File | null>(null);
  const [proofData, setProofData] = useState<any>(null);
  const [publicData, setPublicData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);

  // Use the full type here
  const [externalInputs, setExternalInputs] = useState<ExternalInputInput[]>([]);

  const blueprintSlug = "wryonik/twitter@v2"; // Replace with your blueprint slug

  // Fetch the blueprint and initialize external inputs
  const initializeBlueprint = async () => {
    try {
      const sdk = zkeSDK();
      const fetchedBlueprint = await sdk.getBlueprint(blueprintSlug);
      setBlueprint(fetchedBlueprint);

      // Initialize with all properties from ExternalInputInput
      const inputs = fetchedBlueprint.props.externalInputs?.map((input) => ({
        name: input.name,
        maxLength: input.maxLength,
        value: input.value || "", // Default empty value if missing
    })) || [];

      setExternalInputs(inputs);
    } catch (error) {
      console.error("Error fetching blueprint:", error);
    }
  };

  // Log the blueprint when it is fetched
  useEffect(() => {
    if (blueprint) {
      console.log("Fetched Blueprint:", blueprint);
    } else {
      console.log("Blueprint not available yet.");
    }
  }, [blueprint]);

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEmlFile(e.target.files[0]);
    }
  };

  // Update external input values when user enters
  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = [...externalInputs];
    updatedInputs[index] = {
      ...updatedInputs[index],
      value
    };
    setExternalInputs(updatedInputs);
  };







  // Generate proof
  const generateProof = async () => {
    if (!emlFile) {
        alert("Please upload an EML file.");
        return;
    }
    if (!blueprint) {
        alert("Blueprint not initialized.");
        return;
    }


    setLoading(true);
    try {
        const fileContent = await emlFile.text();

        try {
          await parseEmail(fileContent);
        } catch (err) {
          console.error('Failed to parse email, email is invalid: ', err);
          throw err;
          // TODO: Notify user about this, cannot go to next step, email is invalid
        }

        // Log filecontent, blueprint and external inputs
        console.log("Parsed Email:", fileContent);
        console.log("Blueprint for Proof Generation:", blueprint.props);
        console.log("External Inputs for Proof:", externalInputs);

        // Create prover
        const prover = blueprint.createProver();
        console.log("Payload for Proof Generation:", { fileContent, externalInputs });
        console.info(externalInputs)

        // Generate proof
        let proof
        try {
          proof = await prover.generateProof(fileContent, externalInputs);
        } catch (error: any) {
          if (error.response) {
              // If it's an HTTP error with a response object
              console.error("Error generating proof:", {
                  status: error.response.status,
                  data: error.response.data,
                  headers: error.response.headers,
              });
          } else if (error instanceof Error) {
              // Generic error
              console.error("Error generating proof:", {
                  message: error.message,
                  stack: error.stack,
              });
          } else {
              // Fallback for unknown error types
              console.error("Unknown error generating proof:", error);
          }
          alert("Failed to generate proof. Check the console for details.");
      }


        const { proofData: proofResult, publicData: publicResult } = proof.getProofData();
        setProofData(proofResult);
        setPublicData(publicResult);

        console.log("Proof Generated Successfully:", proofResult, publicResult);
    } catch (error) {
        console.error("Error generating proof:", error);
        alert("Failed to generate proof. Check the console for details.");
    } finally {
        setLoading(false);
    }
};







  // Initialize the blueprint on component mount
  useEffect(() => {
    initializeBlueprint();
  }, []);

  // Debugging
  useEffect(() => {
    if (proofData) {
      console.log("Proof Data:", proofData);
    }
    if (publicData) {
      console.log("Public Data:", publicData);
    }
  }, [proofData, publicData]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", color:'white'}}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        zkEmail Proof Generator
      </h1>
      {/* Upload EML File */}
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Upload EML File:</strong>
          <input
            type="file"
            accept=".eml"
            onChange={handleFileChange}
            style={{
              display: "block",
              marginTop: "5px",
              padding: "10px",
            }}
          />
        </label>
      </div>
      {/* Render Inputs Dynamically */}
      {externalInputs.map((input, index) => (
        <div key={index} style={{ marginBottom: "15px" }}>
          <label>
            <strong>{input.name}:</strong>
            <input
              type="text"
              value={input.value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`Enter ${input.name}`}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                color:"black"
              }}
            />
          </label>
        </div>
      ))}
      {/* Generate Proof Button */}
      <button
        onClick={generateProof}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Generating Proof..." : "Generate Proof"}
      </button>
      {/* Display Proof Data */}
      {proofData && (
        <div style={{ marginTop: "20px" }}>
          <h2>Proof Data</h2>
          <pre
            style={{
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "5px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(proofData, null, 2)}
          </pre>
        </div>
      )}
      {/* Display Public Data */}
      {publicData && (
        <div style={{ marginTop: "20px" }}>
          <h2>Public Data</h2>
          <pre
            style={{
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "5px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(publicData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestZKEmail;




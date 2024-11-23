'use client';
import React, { useState, useEffect } from "react";
import zkeSDK, { Blueprint, Proof, parseEmail } from "@zk-email/sdk";

export type ExternalInputState = {
  name: string;
  value: string;
};

const TestZKEmail: React.FC = () => {
  const [emlFile, setEmlFile] = useState<File | null>(null);
  const [proofData, setProofData] = useState<any>(null);
  const [publicData, setPublicData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [externalInputs, setExternalInputs] = useState<ExternalInputState[]>([]);
  const blueprintSlug = "twit@v1"; // Replace with your blueprint slug

  // Fetch the blueprint and initialize external inputs
  const initializeBlueprint = async () => {
    try {
      const sdk = zkeSDK();
      const fetchedBlueprint = await sdk.getBlueprint(blueprintSlug);
      setBlueprint(fetchedBlueprint);
      // Initialize external inputs dynamically
      const inputs =
        fetchedBlueprint.props.externalInputs?.map((input) => ({
          name: input.name,
          value: "",
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

  // Update external input values
  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = [...externalInputs];
    updatedInputs[index].value = value;
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
    if (externalInputs.some((input) => !input.value)) {
      alert("Please fill in all required inputs.");
      return;
    }
    setLoading(true);
    try {
      const fileContent = await emlFile.text();

      // Check for ProtonMail emails
      if (fileContent.includes("mail.protonmail.ch")) {
        console.log("ProtonMail email detected");
        alert("ProtonMail emails are not supported yet.");
        return;
      }

      // Parse the email content
      try {
        await parseEmail(fileContent);
      } catch (err) {
        console.error("Failed to parse email, email is invalid:", err);
        alert("Failed to parse email. Please check the email file.");
        return;
      }

      const prover = blueprint.createProver();

      // Prepare external inputs
      const externalInputValues = externalInputs.reduce((acc: any, input) => {
        acc[input.name] = input.value;
        return acc;
      }, {});

      // Generate proof using the email content and external inputs
      const proof = await prover.generateProof(fileContent);

      // Extract proof and public data
      const { proofData: proofResult, publicData: publicResult } =
        proof.getProofData();
      setProofData(proofResult);
      setPublicData(publicResult);
    } catch (error) {
      console.error("Error generating proof:", error);
      alert("Failed to generate proof. Check console for details.");
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
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
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


// 'use client';
// import React, { useState, useEffect } from "react";
// import zkeSDK, { Blueprint, Proof, parseEmail } from "@zk-email/sdk";

// export type ExternalInputState = {
//   name: string;
//   value: string;
// };

// const TestZKEmail: React.FC = () => {
//   const [emlFile, setEmlFile] = useState<File | null>(null);
//   const [proofData, setProofData] = useState<any>(null);
//   const [publicData, setPublicData] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
//   const [externalInputs, setExternalInputs] = useState<ExternalInputState[]>([]);
//   const blueprintSlug = "twit@v1"; // Replace with your blueprint slug

//   // Fetch the blueprint and initialize external inputs
//   const initializeBlueprint = async () => {
//     try {
//       const sdk = zkeSDK();
//       const fetchedBlueprint = await sdk.getBlueprint(blueprintSlug);
//       setBlueprint(fetchedBlueprint);
//       // Initialize external inputs dynamically for the user to enter
//       const inputs =
//         fetchedBlueprint.props.externalInputs?.map((input) => ({
//           name: input.name,
//           value: "",
//         })) || [];
//       setExternalInputs(inputs);
//     } catch (error) {
//       console.error("Error fetching blueprint:", error);
//     }
//   };

//   // Log the blueprint when it is fetched
//   useEffect(() => {
//     if (blueprint) {
//       console.log("Fetched Blueprint:", blueprint);
//     } else {
//       console.log("Blueprint not available yet.");
//     }
//   }, [blueprint]);

//   // Handle file upload
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setEmlFile(e.target.files[0]);
//     }
//   };

//   // Update external input values when user enters
//   const handleInputChange = (index: number, value: string) => {
//     const updatedInputs = [...externalInputs];
//     updatedInputs[index].value = value;
//     setExternalInputs(updatedInputs);
//   };

//   // Generate proof
// const generateProof = async () => {
//   if (!emlFile) {
//     alert("Please upload an EML file.");
//     return;
//   }
//   if (!blueprint) {
//     alert("Blueprint not initialized.");
//     return;
//   }
//   if (externalInputs.some((input) => !input.value)) {
//     alert("Please fill in all required inputs.");
//     return;
//   }
//   setLoading(true);
//   try {
//     const fileContent = await emlFile.text();

//     // Check for ProtonMail emails
//     if (fileContent.includes("mail.protonmail.ch")) {
//       console.log("ProtonMail email detected");
//       alert("ProtonMail emails are not supported yet.");
//       return;
//     }

//     // Parse the email content
//     try {
//       await parseEmail(fileContent);
//     } catch (err) {
//       console.error("Failed to parse email, email is invalid:", err);
//       alert("Failed to parse email. Please check the email file.");
//       return;
//     }

//     // Prepare external inputs as an array with updated values
//     const updatedExternalInputs = blueprint.props.externalInputs.map((input) => {
//       const userInput = externalInputs.find((e) => e.name === input.name);
//       return {
//         ...input,
//         value: userInput?.value || "",
//       };
//     });

//     // Update the external inputs on the blueprint instance
//     // Mutating blueprint here is acceptable in this context
//     blueprint.props.externalInputs = updatedExternalInputs;
//     console.log("blueprint: ", blueprint)

//     const prover = blueprint.createProver();

//     // Generate proof using the email content
//     const proof = await prover.generateProofRequest(fileContent);

//     // Extract proof and public data
//     const { proofData: proofResult, publicData: publicResult } =
//       proof.getProofData();
//     setProofData(proofResult);
//     setPublicData(publicResult);
//   } catch (error) {
//     console.error("Error generating proof:", error);
//     alert("Failed to generate proof. Check console for details.");
//   } finally {
//     setLoading(false);
//   }
// };


//   // Initialize the blueprint on component mount
//   useEffect(() => {
//     initializeBlueprint();
//   }, []);

//   // Debugging
//   useEffect(() => {
//     if (proofData) {
//       console.log("Proof Data:", proofData);
//     }
//     if (publicData) {
//       console.log("Public Data:", publicData);
//     }
//   }, [proofData, publicData]);

//   return (
//     <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
//       <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
//         zkEmail Proof Generator
//       </h1>
//       {/* Upload EML File */}
//       <div style={{ marginBottom: "15px" }}>
//         <label>
//           <strong>Upload EML File:</strong>
//           <input
//             type="file"
//             accept=".eml"
//             onChange={handleFileChange}
//             style={{
//               display: "block",
//               marginTop: "5px",
//               padding: "10px",
//             }}
//           />
//         </label>
//       </div>
//       {/* Render Inputs Dynamically */}
//       {externalInputs.map((input, index) => (
//         <div key={index} style={{ marginBottom: "15px" }}>
//           <label>
//             <strong>{input.name}:</strong>
//             <input
//               type="text"
//               value={input.value}
//               onChange={(e) => handleInputChange(index, e.target.value)}
//               placeholder={`Enter ${input.name}`}
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 marginTop: "5px",
//               }}
//             />
//           </label>
//         </div>
//       ))}
//       {/* Generate Proof Button */}
//       <button
//         onClick={generateProof}
//         disabled={loading}
//         style={{
//           width: "100%",
//           padding: "10px",
//           backgroundColor: loading ? "#ccc" : "#007bff",
//           color: "white",
//           border: "none",
//           cursor: loading ? "not-allowed" : "pointer",
//           fontWeight: "bold",
//         }}
//       >
//         {loading ? "Generating Proof..." : "Generate Proof"}
//       </button>
//       {/* Display Proof Data */}
//       {proofData && (
//         <div style={{ marginTop: "20px" }}>
//           <h2>Proof Data</h2>
//           <pre
//             style={{
//               background: "#f4f4f4",
//               padding: "10px",
//               borderRadius: "5px",
//               overflowX: "auto",
//             }}
//           >
//             {JSON.stringify(proofData, null, 2)}
//           </pre>
//         </div>
//       )}
//       {/* Display Public Data */}
//       {publicData && (
//         <div style={{ marginTop: "20px" }}>
//           <h2>Public Data</h2>
//           <pre
//             style={{
//               background: "#f4f4f4",
//               padding: "10px",
//               borderRadius: "5px",
//               overflowX: "auto",
//             }}
//           >
//             {JSON.stringify(publicData, null, 2)}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TestZKEmail;


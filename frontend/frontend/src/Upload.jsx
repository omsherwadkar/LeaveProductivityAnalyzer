import { useState } from "react";

export default function Upload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/upload`,
        {
          method: "POST",
          body: formData
        }
      );

      const result = await response.json();

      if (response.ok) {
        onUploadSuccess();
        setStatus(result.message || "Upload successful");
      } else {
        setStatus(result.error || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      setStatus("Upload failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8"
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "8px",
          width: "420px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>
          Leave & Productivity Analyzer
        </h2>

        <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
          Upload an Excel attendance sheet to analyze worked hours, leaves,
          and productivity.
        </p>

        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          style={{ marginBottom: "15px", width: "100%" }}
        />

        <button
          onClick={handleUpload}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "15px"
          }}
        >
          Upload Excel File
        </button>

        {status && (
          <p style={{ marginTop: "15px", fontSize: "14px", color: "#333" }}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

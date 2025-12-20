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
        onUploadSuccess(); // ✅ show dashboard
        setStatus(result.message || "Upload completed");
      } else {
        setStatus(result.error || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      setStatus("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Attendance Excel</h2>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <br />
      <br />
      <button onClick={handleUpload}>Upload</button>
      <p>{status}</p>
    </div>
  );
}

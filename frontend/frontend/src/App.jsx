import { useState } from "react";
import Upload from "./Upload";
import Dashboard from "./Dashboard";

function App() {
  const [hasUploaded, setHasUploaded] = useState(false);

  return (
    <div>
      <h1>Leave & Productivity Analyzer</h1>

      <Upload onUploadSuccess={() => setHasUploaded(true)} />

      {hasUploaded && <Dashboard />}
    </div>
  );
}

export default App;

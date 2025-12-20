import Upload from "./Upload";
import Dashboard from "./Dashboard";

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Leave & Productivity Analyzer</h1>

      <Upload />

      <hr />

      <Dashboard />
    </div>
  );
}

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2024);
  const [data, setData] = useState({
    totalExpected: 0,
    totalWorked: 0,
    leavesUsed: 0,
    productivity: 0,
    daily: []
  });

  const fetchSummary = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/summary?employeeId=1&month=${month}&year=${year}`
      );
      const result = await res.json();
      setData({
        totalExpected: result.totalExpected ?? 0,
        totalWorked: result.totalWorked ?? 0,
        leavesUsed: result.leavesUsed ?? 0,
        productivity: result.productivity ?? 0,
        daily: Array.isArray(result.daily) ? result.daily : []
      });
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div>
      <h2>Monthly Dashboard</h2>

      <label>
        Month:
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          style={{ marginLeft: "5px" }}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </label>

      <label style={{ marginLeft: "10px" }}>
        Year:
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ marginLeft: "5px", width: "80px" }}
        />
      </label>

      <button onClick={fetchSummary} style={{ marginLeft: "10px" }}>
        View
      </button>

      <p><b>Expected Hours:</b> {data.totalExpected}</p>
      <p><b>Worked Hours:</b> {data.totalWorked}</p>
      <p><b>Leaves Used:</b> {data.leavesUsed} / 2</p>
      <p><b>Productivity:</b> {data.productivity.toFixed(2)}%</p>

      <h3>Daily Attendance</h3>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Date</th>
            <th>In</th>
            <th>Out</th>
            <th>Worked</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.daily.map(row => (
            <tr key={row.id}>
              <td>{row.date}</td>
              <td>{row.in_time || "-"}</td>
              <td>{row.out_time || "-"}</td>
              <td>{row.worked_hours}</td>
              <td>{row.is_leave ? "Leave" : "Present"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

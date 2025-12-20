import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2024);

  const fetchSummary = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/summary?employeeId=1&month=${month}&year=${year}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch summary");
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div>
      <h2>Monthly Dashboard</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Month:
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
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
            onChange={(e) => setYear(e.target.value)}
            style={{ marginLeft: "5px", width: "80px" }}
          />
        </label>

        <button onClick={fetchSummary} style={{ marginLeft: "10px" }}>
          View
        </button>
      </div>

      {!data ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <p><b>Expected Hours:</b> {data.totalExpected}</p>
          <p><b>Worked Hours:</b> {data.totalWorked}</p>
          <p><b>Leaves Used:</b> {data.leavesUsed} / 2</p>
          <p><b>Productivity:</b> {data.productivity.toFixed(2)}%</p>

          <h3>Daily Attendance</h3>

          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Date</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Worked Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.daily.map((row) => (
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
        </>
      )}
    </div>
  );
}

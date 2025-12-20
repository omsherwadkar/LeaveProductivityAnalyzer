const express = require("express");
const db = require("../db");
const { getExpectedHours } = require("../utils/timeUtils");

const router = express.Router();

/**
 * GET /summary
 * Query params:
 *  - employeeId
 *  - month (1–12)
 *  - year (YYYY)
 */
router.get("/", (req, res) => {
  const { employeeId, month, year } = req.query;

  if (!employeeId || !month || !year) {
    return res.status(400).json({
      error: "employeeId, month, and year are required"
    });
  }

  const query = `
    SELECT *
    FROM attendance
    WHERE employee_id = ?
      AND MONTH(date) = ?
      AND YEAR(date) = ?
  `;

  db.query(query, [employeeId, month, year], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    let totalWorked = 0;
    let totalExpected = 0;
    let leavesUsed = 0;

    rows.forEach(row => {
      totalWorked += row.worked_hours;
      totalExpected += getExpectedHours(row.date);
      if (row.is_leave) leavesUsed++;
    });

    const productivity =
      totalExpected === 0
        ? 0
        : (totalWorked / totalExpected) * 100;

    res.json({
      totalWorked,
      totalExpected,
      leavesUsed,
      productivity,
      daily: rows
    });
  });
});

module.exports = router;

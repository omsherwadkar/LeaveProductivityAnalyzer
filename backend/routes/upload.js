const express = require("express");
const multer = require("multer");
const ExcelJS = require("exceljs");
const db = require("../db");
const {
  calculateWorkedHours,
  getExpectedHours
} = require("../utils/timeUtils");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function normalizeEmployeeName(value) {
  if (!value) return null;

  if (typeof value === "string") return value.trim();

  if (typeof value === "object") {
    if (value.text) return value.text.trim();
    if (value.richText) {
      return value.richText.map(r => r.text).join("").trim();
    }
  }

  return String(value).trim();
}

function normalizeDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  if (typeof value === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + value * 86400000);
    return date.toISOString().split("T")[0];
  }

  const date = new Date(value);
  if (!isNaN(date)) {
    return date.toISOString().split("T")[0];
  }

  return null;
}

router.post("/", upload.single("file"), async (req, res) => {
  console.log(" Upload endpoint hit");

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    await new Promise((resolve, reject) => {
      db.query("DELETE FROM attendance", err => {
        if (err) return reject(err);
        db.query("DELETE FROM employees", err => {
          if (err) return reject(err);
          console.log(" Database cleared");
          resolve();
        });
      });
    });
  await new Promise((resolve, reject) => {
   db.query("ALTER TABLE employees AUTO_INCREMENT = 1", err => {
    if (err) return reject(err);
    db.query("ALTER TABLE attendance AUTO_INCREMENT = 1", err => {
      if (err) return reject(err);
      resolve();
    });
  });
});


    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.worksheets[0];

    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      rows.push({
        employeeName: normalizeEmployeeName(row.getCell(1).value),
        date: normalizeDate(row.getCell(2).value),
        inTime: row.getCell(3).value || null,
        outTime: row.getCell(4).value || null
      });
    });

    console.log("Rows read from Excel:", rows.length);

    for (const row of rows) {
      console.log("Processing row:", row);

      const { employeeName, date, inTime, outTime } = row;
      if (!employeeName || !date) continue;

      // Find or create employee
      const employees = await new Promise((resolve, reject) => {
        db.query(
          "SELECT id FROM employees WHERE name = ?",
          [employeeName],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      let employeeId;

      if (employees.length === 0) {
        const result = await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO employees (name) VALUES (?)",
            [employeeName],
            (err, res) => {
              if (err) reject(err);
              else resolve(res);
            }
          );
        });
        employeeId = result.insertId;
      } else {
        employeeId = employees[0].id;
      }

      const worked = calculateWorkedHours(inTime, outTime);
      const expected = getExpectedHours(date);
      const isLeave = expected > 0 && worked === 0;

      await new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO attendance
           (employee_id, date, in_time, out_time, worked_hours, is_leave)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            employeeId,
            date,
            inTime,
            outTime,
            worked,
            isLeave
          ],
          err => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      console.log("Inserted attendance for", employeeName, date);
    }

    console.log("Upload processing completed");
    res.json({ message: "Excel uploaded and processed successfully" });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;

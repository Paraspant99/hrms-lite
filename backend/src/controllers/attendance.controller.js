const pool = require("../db");
const { markAttendanceSchema } = require("../validators/attendance.schema");

async function markAttendance(req, res) {
  const payload = markAttendanceSchema.parse(req.body);

  const [empRows] = await pool.execute(`SELECT id FROM employees WHERE id = ?`, [
    payload.employeeDbId,
  ]);
  if (empRows.length === 0) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const [result] = await pool.execute(
    `INSERT INTO attendance (employee_id, date, status)
     VALUES (?, ?, ?)`,
    [payload.employeeDbId, payload.date, payload.status]
  );

  return res.status(201).json({
    id: result.insertId,
    employeeDbId: payload.employeeDbId,
    date: payload.date,
    status: payload.status,
  });
}

async function listAttendanceForEmployee(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid employee id" });
  }

  const { from, to } = req.query;

  let sql = `SELECT id, date, status, created_at AS createdAt
             FROM attendance
             WHERE employee_id = ?`;
  const params = [id];

  if (from) {
    sql += ` AND date >= ?`;
    params.push(from);
  }
  if (to) {
    sql += ` AND date <= ?`;
    params.push(to);
  }

  sql += ` ORDER BY date DESC`;

  const [rows] = await pool.execute(sql, params);
  return res.json(rows);
}

async function attendanceSummary(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid employee id" });
  }

  const [rows] = await pool.execute(
    `SELECT
       SUM(status='PRESENT') AS presentDays,
       SUM(status='ABSENT') AS absentDays
     FROM attendance
     WHERE employee_id = ?`,
    [id]
  );

  return res.json({
    presentDays: Number(rows[0]?.presentDays || 0),
    absentDays: Number(rows[0]?.absentDays || 0),
  });
}

module.exports = { markAttendance, listAttendanceForEmployee, attendanceSummary };

const pool = require("../db");
const { createEmployeeSchema } = require("../validators/employees.schema");

async function createEmployee(req, res) {
  const payload = createEmployeeSchema.parse(req.body);

  const [result] = await pool.execute(
    `INSERT INTO employees (employee_id, full_name, email, department)
     VALUES (?, ?, ?, ?)`,
    [payload.employeeId, payload.fullName, payload.email, payload.department]
  );

  return res.status(201).json({
    id: result.insertId,
    employeeId: payload.employeeId,
    fullName: payload.fullName,
    email: payload.email,
    department: payload.department,
  });
}

async function listEmployees(req, res) {
  const [rows] = await pool.execute(
    `SELECT id,
            employee_id AS employeeId,
            full_name AS fullName,
            email,
            department,
            created_at AS createdAt
     FROM employees
     ORDER BY id DESC`
  );

  return res.json(rows);
}

async function deleteEmployee(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid employee id" });
  }

  const [result] = await pool.execute(`DELETE FROM employees WHERE id = ?`, [id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Employee not found" });
  }

  return res.status(204).send();
}

module.exports = { createEmployee, listEmployees, deleteEmployee };

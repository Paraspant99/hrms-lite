require("dotenv").config();
const app = require("./app");
const pool = require("./db");

const PORT = process.env.PORT || 5001;

async function start() {
  // DB check
  await pool.query("SELECT 1");

  // Create tables if not exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id VARCHAR(50) NOT NULL UNIQUE,
      full_name VARCHAR(200) NOT NULL,
      email VARCHAR(200) NOT NULL UNIQUE,
      department VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id INT NOT NULL,
      date DATE NOT NULL,
      status ENUM('PRESENT','ABSENT') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_employee_date (employee_id, date),
      CONSTRAINT fk_att_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON DELETE CASCADE
    );
  `);

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

const { z } = require("zod");

const createEmployeeSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required").max(50),
  fullName: z.string().min(1, "Full Name is required").max(120),
  email: z.string().email("Invalid email format").max(120),
  department: z.string().min(1, "Department is required").max(80),
});

module.exports = { createEmployeeSchema };

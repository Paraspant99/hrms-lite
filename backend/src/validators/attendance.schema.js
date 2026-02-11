const { z } = require("zod");

const markAttendanceSchema = z.object({
  employeeDbId: z.number().int().positive("employeeDbId must be a valid number"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  status: z.enum(["PRESENT", "ABSENT"]),
});

module.exports = { markAttendanceSchema };

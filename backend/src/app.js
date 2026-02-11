const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const employeesRoutes = require("./routes/employees.routes");
const errorMiddleware = require("./middleware/error.middleware");
const asyncHandler = require("./middleware/async.middleware");

const {
  markAttendance,
  listAttendanceForEmployee,
  attendanceSummary,
} = require("./controllers/attendance.controller");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: false,
  })
);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/employees", employeesRoutes);

app.post("/api/attendance", asyncHandler(markAttendance));
app.get("/api/employees/:id/attendance", asyncHandler(listAttendanceForEmployee));
app.get("/api/employees/:id/attendance/summary", asyncHandler(attendanceSummary));

app.use(errorMiddleware);

module.exports = app;

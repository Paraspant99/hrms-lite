const express = require("express");
const asyncHandler = require("../middleware/async.middleware");
const {
  createEmployee,
  listEmployees,
  deleteEmployee,
} = require("../controllers/employees.controller");

const router = express.Router();

router.post("/", asyncHandler(createEmployee));
router.get("/", asyncHandler(listEmployees));
router.delete("/:id", asyncHandler(deleteEmployee));

module.exports = router;

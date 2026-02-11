function errorMiddleware(err, req, res, next) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        message: "Validation error",
        details: err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }
  
    if (err && (err.code === "ER_DUP_ENTRY" || err.errno === 1062)) {
      return res.status(409).json({
        message: "Duplicate record",
        details: err.sqlMessage,
      });
    }
  
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
  
  module.exports = errorMiddleware;
  

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || (res.statusCode >= 400 && res.statusCode < 600 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
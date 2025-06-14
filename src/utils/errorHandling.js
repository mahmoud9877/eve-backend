export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err); // ما فيش داعي نغلف الخطأ في Error تانية
    });
  };
};

export const globalErrorHandling = (err, req, res, next) => {
  const statusCode = err.statusCode || err.cause || 500;

  return res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    error: err,
    stack: err.stack, // ممكن تشيلها لو مش عايز تبين تفاصيل
  });
};

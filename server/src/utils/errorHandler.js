import { ApiError } from "./ApiError.js";

const errorHandler = (err, req, res, next) => {
  
  console.log(`Error: ${err.message}`);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export { errorHandler };

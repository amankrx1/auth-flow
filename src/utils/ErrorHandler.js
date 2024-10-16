export class ErrorHandler extends Error {
  constructor(message, StatusCode) {
    super(message);
    this.statusCode = StatusCode;
  }
}

export const ErrorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;
  console.log(`${err} first`)

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    // Note: err.code is used for duplicate key errors
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try again";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token has expired. Try again";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "SyntaxError") {
    const message = "Syntax Error. Please check your request body";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TypeError") {
    const message = `Type Error. ${err.message}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "ReferenceError") {
    const message = `Reference Error. ${err.message}`;
    err = new ErrorHandler(message, 400);
  }

  // console.log(`${err} last`)
  err.status = err.status || "error";
  
  res.status(err.statusCode).json({
    success: false,
    status: err.statusCode,
    error: err.message,
    data: {},
  });
};

import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import User from "../Model/User.js";
import StatusCodes from "http-status-codes";
import { JWT_SECRET } from "../config/config.js";


export const isAdmin = catchAsyncError(async (req, res, next) => {
    if(req.user.role !== "Admin"){
      return next(new ErrorHandler("This is a protected routes for Admin", StatusCodes.UNAUTHORIZED))
    }
    next();
});
export const auth = catchAsyncError(async (req, res, next) => {
    console.log(req.body)
    const token = req.body.token
    if (!token) {
        return next(new ErrorHandler("token missing", StatusCodes.UNAUTHORIZED));
    }
    const decode = jwt.decode(token, JWT_SECRET);
    console.log(decode)
    req.user = decode
    next();
});

export const isStudent = catchAsyncError(async (req, res, next) => {
    if(req.user.role !== "Student"){
      return next(new ErrorHandler("This is a protected routes for students", StatusCodes.UNAUTHORIZED))
    }
    next();
});


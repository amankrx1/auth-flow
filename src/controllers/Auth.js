import bcrypt from "bcrypt";
import User from "../Model/User.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import zod from "zod";
import StatusCodes  from "http-status-codes";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

const userValidator = zod.object({
  name: zod.string(),
  email: zod.string().email({ message: "Invalid email address!" }),
  password: zod
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "A minimum 8 characters password contains a combination of uppercase and lowercase letter and number are required",
      }
    ),
  role: zod.enum(["Admin", "Student", "Visitor"], {
    message: "Role must be admin, visitor or Student",
  }),
});

export const signUp = catchAsyncError(async (req, res, next) => {
  const userData = req.body;

  const response = userValidator.safeParse(userData);
  if (!response.success) {
    return next(
      new ErrorHandler(
        response.error.errors[0].message,
        StatusCodes.BAD_REQUEST
      )
    );
  }

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    return next(
      new ErrorHandler("User already exists", StatusCodes.BAD_REQUEST)
    );
  }

  let hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;
  console.log(userData);
  const user = await User.create(userData);
  res.status(StatusCodes.OK).json({
    sucess: true,
    message: "User created successfully",
    data: user,
  });
});

export const login = catchAsyncError(async (req, res, next) => {
  const userData = req.body;
  if (!userData.email || !userData.password) {
    return next(
      new ErrorHandler(
        "Please fill all the details carefully",
        StatusCodes.BAD_REQUEST
      )
    );
  }
  const existingUser = await User.findOne({ email: userData.email });
  if (!existingUser) {
    return next(
      new ErrorHandler("User not registered", StatusCodes.UNAUTHORIZED)
    );
  }

  const payload = {
    email: existingUser.email,
    id: existingUser._id,
    role: existingUser.role,
  };

  if (await bcrypt.compare(userData.password, existingUser.password)) {
    let token = jwt.sign(payload, JWT_SECRET);

    const user = existingUser.toObject();
    user.token = token
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, options).status(StatusCodes.OK).json({
      success: true,
      user,
      message: "User loggedin successfully",
    });
  } else {
    return next(new ErrorHandler("Incorrect password!", StatusCodes.FORBIDDEN));
  }
});

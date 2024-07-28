import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../Utils/catchAsync.js";
import HandleError from "../Utils/handleError.js";
import { sendEmailCode, verifyEmailCode } from "../Utils/emailHandler.js";
import User from "../Models/userMd.js";

export const auth = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g;
  if (!emailRegex.test(email)) {
    return next(new HandleError("Invalid regex pattern for email.", 400));
  }
  const user = await User.findOne({ email });
  if (!user || !user.password) {
	//? dont wanna add sth like use your code you not allow to send another ?
    await sendEmailCode(email);
    return res.status(200).json({
      success: true,
      message: `Email with code to ${email} sent successfully.`,
      isExist: !!user,
    });
  }
  return res.status(200).json({
    success: true,
    message: "User exists and has a password. So user will offer to login by entaring password",
    isExist: true,
  });
});

export const loginWithPassword = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g;
  if (!emailRegex.test(email)) {
    return next(new HandleError("Invalid regex pattern for email.", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new HandleError(
        "User not found. Please check the email and try again.",
        404
      )
    );
  }
  if (!bcryptjs.compareSync(password, user.password)) {
    return next(
      new HandleError("Invalid password. Please check your password.", 401)
    );
  }
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET
  );
  return res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        role: user.role,
        email: user.email,
        cart: user.cart,
        isComplete: user.isComplete,
      },
    },
    message: "Logged in successfully.",
  });
});

export const sendingEmailCode = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g;
  if (!emailRegex.test(email)) {
    return next(new HandleError("Invalid regex pattern for email.", 400));
  }
  await sendEmailCode(email);

  return res.status(200).json({
    success: true,
    message: `Email with code to ${email} sent successfully.`,
  });
});

export const verifyingEmailCode = catchAsync(async (req, res, next) => {
  const { email, code } = req.body;
  const emailResult = await verifyEmailCode(email, code);

  if (!emailResult.success) {
    return next(
      new HandleError("The sent code is not correct. Invalid SMTP code.", 401)
    );
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET
  );

  return res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        role: user.role,
        email: user.email,
        cart: user.cart,
        isComplete: user.isComplete,
      },
    },
    isCodeValidated: true,
    message: "SMTP validated successfully.",
  });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { phone } = req.body; //! continue + writing new Cn for verifying Email add expire time and delete after checking fron let array
  const user = await User.findOne({ phone });

  if (!user) {
    return next(new HandleError("User not found. Please sign up first.", 404));
  }

  await sendAuthCode(phone);

  return res.status(200).json({
    success: true,
    message: "SMS code sent successfully.",
  });
});

export const checkOtpForgetPassword = catchAsync(async (req, res, next) => {
  const { phone, code } = req.body;
  const user = await User.findOne({ phone });

  if (!user) {
    return next(new HandleError("User not found. Please sign up first.", 404));
  }

  const smsResult = await verifyCode(phone, code);

  if (!smsResult.success) {
    return next(
      new HandleError("The sent code is not correct. Invalid OTP code.", 401)
    );
  }

  const token = jwt.sign(
    { id: user._id, phone: user.phone, role: user.role, changePassword: true },
    process.env.JWT_SECRET
  );

  return res.status(200).json({
    success: true,
    data: {
      token,
    },
    isCodeValidated: true,
    message: "OTP validated successfully.",
  });
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new HandleError("Token is required for authentication.", 401));
  }

  const { password } = req.body;
  const { id, changePassword } = jwt.verify(
    authorization.split(" ")[1],
    process.env.JWT_SECRET
  );

  const user = await User.findById(id);

  if (!user) {
    return next(
      new HandleError(
        "User not found. Please check the phone number and try again.",
        404
      )
    );
  }

  if (!changePassword) {
    return next(
      new HandleError(
        "Authentication failed. ChangePassword is undefined.",
        401
      )
    );
  }

  const regex = /(?=.*?[a-z])(?=.*?[0-9]).{8,}$/g;

  if (!regex.test(password)) {
    return next(
      new HandleError(
        "Password must be at least 8 characters long and contain at least one letter and one number.",
        400
      )
    );
  }

  const newPassword = bcryptjs.hashSync(password, 10);
  const newUser = await User.findByIdAndUpdate(
    id,
    { password: newPassword },
    { new: true, runValidators: true }
  );

  const token = jwt.sign(
    { id: newUser._id, phone: newUser.phone, role: newUser.role },
    process.env.JWT_SECRET
  );

  return res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        role: newUser.role,
        phone: newUser.phone,
        cart: newUser.cart,
        isComplete: newUser.isComplete,
      },
    },
    message: "Password changed successfully.",
  });
});

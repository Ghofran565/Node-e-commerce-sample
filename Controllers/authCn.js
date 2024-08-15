import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import catchAsync from '../Utils/catchAsync.js';
import HandleError from '../Utils/handleError.js';
import { sendEmailCode, verifyEmailCode } from '../Utils/emailHandler.js';
import User from '../Models/userMd.js';

const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g;
const verificationCodeRegex = /\b\d{5}\b/g;
const passwordRegex = /(?=.*?[a-z])(?=.*?[0-9]).{8,}$/g;

export const auth = catchAsync(async (req, res, next) => {
	const { email } = req.body;
	if (!emailRegex.test(email)) {
		return next(new HandleError('Invalid email format.', 400));
	}
	const user = await User.findOne({ email });
	if (!user || !user.password) {
		await sendEmailCode(email);
		return res.status(200).json({
			success: true,
			message: `Email with code to ${email} sent successfully.`,
			isExist: !!user,
		});
	}
	return res.status(200).json({
		success: true,
		message:
			'User exists and has a password. Prompt user to login with password.',
		isExist: true,
	});
});

export const loginWithPassword = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!emailRegex.test(email)) {
		return next(new HandleError('Invalid email format.', 400));
	}
	const user = await User.findOne({ email });
	if (!user) {
		return next(
			new HandleError(
				'User not found. Please check the email and try again.',
				404
			)
		);
	}
	if (!bcryptjs.compareSync(password, user.password)) {
		return next(
			new HandleError('Invalid password. Please check your password.', 401)
		);
	}
	const token = jwt.sign(
		{ id: user._id, email: user.email, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: '5d' }
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
		message: 'Logged in successfully.',
	});
});

export const sendingEmailCode = catchAsync(async (req, res, next) => {
	const { email } = req.body;
	if (!emailRegex.test(email)) {
		return next(new HandleError('Invalid email format.', 400));
	}
	await sendEmailCode(email);
	return res.status(200).json({
		success: true,
		message: `Email with code to ${email} sent successfully.`,
	});
});

export const verifyingEmailCode = catchAsync(async (req, res, next) => {
	const { email, code } = req.body;
	if (!emailRegex.test(email)) {
		return next(new HandleError('Invalid email format.', 400));
	}
	if (!verificationCodeRegex.test(code)) {
		return next(new HandleError('Invalid verification code format.', 400));
	}
	const verificationResult = await verifyEmailCode(email, code);
	if (!verificationResult.authorized) {
		return next(new HandleError('Invalid verification code.', 401));
	}
	let user = await User.findOne({ email });
	if (!user) {
		user = await User.create({ email });
	}
	const token = jwt.sign(
		{ id: user._id, email: user.email, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: '5d' }
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
		message: 'Email verified successfully.',
	});
});

export const forgetPassword = catchAsync(async (req, res, next) => {
	const { email } = req.body;
	if (!emailRegex.test(email)) {
		return next(new HandleError('Invalid email format.', 400));
	}
	const user = await User.findOne({ email });
	if (!user) {
		return next(new HandleError('User not found. Please sign up first.', 404));
	}
	await sendEmailCode(email);
	return res.status(200).json({
		success: true,
		message: `Email with code to ${email} sent successfully.`,
	});
});

export const checkForgetPassword = catchAsync(async (req, res, next) => {
	const { email, code } = req.body;
	if (!emailRegex.test(email)) {
		return next(new HandleError('Invalid email format.', 400));
	}
	if (!verificationCodeRegex.test(code)) {
		return next(new HandleError('Invalid verification code format.', 400));
	}
	const user = await User.findOne({ email });
	if (!user) {
		return next(new HandleError('User not found. Please sign up first.', 404));
	}
	const verificationResult = await verifyEmailCode(email, code);
	if (!verificationResult.authorized) {
		return next(new HandleError('Invalid verification code.', 401));
	}
	const token = jwt.sign(
		{ id: user._id, email: user.email, role: user.role, changePassword: true },
		process.env.JWT_SECRET,
		{ expiresIn: '5d' }
	);
	return res.status(200).json({
		success: true,
		data: { token },
		isCodeValidated: true,
		message: 'Verification code validated successfully.',
	});
});

export const changePassword = catchAsync(async (req, res, next) => {
	const { id: bodyId, password } = req.body;
	const { id, changePassword } = req.decodedToken;

	if (!changePassword) {
		return next(
			new HandleError('Unauthorized request to change password.', 401)
		);
	}

	if (id !== bodyId) {
		return next(
			new HandleError('Unauthorized request. User ID mismatch.', 401)
		);
	}

	if (!passwordRegex.test(password)) {
		return next(
			new HandleError(
				'Password must be at least 8 characters long and contain at least one letter and one number.',
				400
			)
		);
	}

	const hashedPassword = bcryptjs.hashSync(password, 10);
	const user = await User.findByIdAndUpdate(
		id,
		{ password: hashedPassword },
		{ new: true, runValidators: true }
	);

	if (!user) {
		return next(new HandleError('User not found. Please try again.', 404));
	}

	const newToken = jwt.sign(
		{ id: user._id, email: user.email, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: '5d' }
	);

	return res.status(200).json({
		success: true,
		data: {
			token: newToken,
			user: {
				role: user.role,
				email: user.email,
				cart: user.cart,
				isComplete: user.isComplete,
			},
		},
		message: 'Password changed successfully.',
	});
});

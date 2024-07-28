import jwt from 'jsonwebtoken';
import HandleError from '../Utils/handleError.js';
import catchAsync from '../Utils/catchAsync.js';
import User from '../Models/userMd.js';

export const protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(
			new HandleError(
				'You have not sent any token. Please send one to check if you are logged in.',
				401
			)
		);
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(
			new HandleError(
				'The user belonging to this token does no longer exist.',
				401
			)
		);
	}

	req.user = currentUser;
	req.decodedToken = decoded;
	return next();
});

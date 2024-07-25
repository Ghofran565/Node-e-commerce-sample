import catchAsync from '../Utils/catchAsync.js';
import HandleError from '../Utils/handleError.js';
import jwt from 'jsonwebtoken';

const isLogin = catchAsync(async (req, res, next) => {
	if (!req.headers.authorization) {
		return next(
			new HandleError(
				'You have not send any token. please send one to check if you loged in.',
				401
			)
		);
	}
	const token = jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.JWT_SECRET
	);
	if (token) {
		return next();
	} else {
		return next(
			new HandleError('Authentication required. Please log in.', 401)
		);
	}
});

export default isLogin;

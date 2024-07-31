import jwt from 'jsonwebtoken';
import catchAsync from '../Utils/catchAsync.js';
import HandleError from '../Utils/handleError.js';

const isAdmin = (allowedRoles) =>
	catchAsync(async (req, res, next) => {
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

		const { role } = jwt.verify(token, process.env.JWT_SECRET);

		if (!allowedRoles.includes(role)) {
			return next(
				new HandleError(
					`Access denied. You don't have permission for this action because you are not ${allowedRoles}.`,
					403
				)
			);
		}
		return next();
	});

export default isAdmin;

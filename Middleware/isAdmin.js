import jwt from 'jsonwebtoken';
import catchAsync from '../Utils/catchAsync.js';
import HandleError from '../Utils/handleError.js';

const isAdmin = catchAsync(async (req, res, next) => {
	if (!req.headers.authorization) {
		return next(
			new HandleError('You have not send any token. please send one to check if you are admin.', 401)
		);
	}
	const { role } = jwt.verify(
		req.headers.authorization.split(' ')[1],
		process.env.JWT_SECRET
	);
	if (role !== 'admin')
		return next(
			new HandleError(
				"Access denied. You don't have permission because you are not admin.",
				403
			)
		);
	return next();
});

export default isAdmin;

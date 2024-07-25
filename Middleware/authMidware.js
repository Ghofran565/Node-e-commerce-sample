import jwt from 'jsonwebtoken';
import HandleError from '../Utils/handleError.js';

export const protect = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		return next(new HandleError('Not authorized. No token provided.', 401));
	}

	try { //! continue 
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; 
		next();
	} catch (err) {
		return next(new HandleError('Not authorized. Token is invalid or maybe expired.', 401));
	}
};

export const restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new HandleError('You do not have permission to perform this action.', 403));
		}
		next();
	};
};

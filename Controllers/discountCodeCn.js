import catchAsync from '../Utils/catchAsync.js';
import ApiFeatures from '../Utils/apiFeatures.js';
import HandleError from '../Utils/handleError.js';
import DiscountCode from '../Models/discountCodeMd.js';
import User from '../Models/userMd.js';

export const getAllDiscountCode = catchAsync(async (req, res, next) => {
	const discountCodeFeatures = new ApiFeatures(DiscountCode, req?.query)
		.filters()
		.sort()
		.limitFields()
		.paginate()
		.populate();
	const discountCodes = await discountCodeFeatures.query;
	return res.status(200).json({
		success: true,
		data: { discountCodes },
	});
});

export const getOneDiscountCode = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const discountCode = await DiscountCode.findById(id);
	if (!discountCode) {
		return next(new HandleError(`DiscountCode with ID ${id} not found.`, 404));
	}
	return res.status(200).json({
		success: true,
		data: { discountCode },
	});
});

export const createDiscountCode = catchAsync(async (req, res, next) => {
	const newDiscountCode = await DiscountCode.create(req?.body);
	return res.status(200).json({
		success: true,
		message: 'DiscountCode created successfully.',
		data: { newDiscountCode },
	});
});

export const updateDiscountCode = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const updatedDiscountCode = await DiscountCode.findByIdAndUpdate(
		id,
		req?.body,
		{
			new: true,
			runValidators: true,
		}
	);
	if (!updatedDiscountCode) {
		return next(new HandleError(`DiscountCode with ID ${id} not found.`, 404));
	}
	return res.status(200).json({
		success: true,
		message: `DiscountCode with ID ${id} updated successfully.`,
		data: { updatedDiscountCode },
	});
});

export const checkDiscountCode = catchAsync(async (req, res, next) => {
	const { id: userId } = req.decodedToken;
	const { code: discountCodeBody } = req?.body;
	const now = Date.now();

	if (!discountCodeBody) {
		return next(
			new HandleError('Please provide a discount code.', 400)
		);
	}

	const user = await User.findById(userId);
	if (!user) {
		return next(
			new HandleError(
				`User not found. This shouldn't happen, as we're getting the ID from the token!`,
				400
			)
		);
	}

	const discountCode = await DiscountCode.findOne({ code: discountCodeBody });
	if (!discountCode) {
		return res.status(200).json({
			success: true,
			message: 'Discount code does not exist.',
		});
	}

	if (discountCode.expireTime < now || discountCode.startTime > now) {
		return res.status(200).json({
			success: true,
			message: 'This discount code is either expired or not yet active.',
		});
	}

	if (user?.usedDiscountCode?.includes(discountCodeBody)) {
		return res.status(200).json({
			success: true,
			message: 'You have already used this discount code.',
		});
	}

	return res.status(200).json({
		success: true,
		message: 'Discount code is valid!',
		data: { discount: discountCode.discount },
	});
});

import catchAsync from '../Utils/catchAsync.js';
import ApiFeatures from '../Utils/apiFeatures.js';
import HandleError from '../Utils/handleError.js';
import Address from '../Models/addressMd.js';

export const getAllAddress = catchAsync(async (req, res, next) => {
	const { role, id } = req.decodedToken;
	let queryString = {
		...req?.query,
		filters: { ...req?.query?.filters, userId: id },
	};
	if (role === 'admin' || role === 'superAdmin') {
		queryString = { ...req?.query };
	}

	const addressFeatures = new ApiFeatures(Address, queryString)
		.filters()
		.sort()
		.limitFields()
		.paginate()
		.populate();
	const addresses = await addressFeatures.query;

	return res.status(200).json({
		success: true,
		data: { addresses },
	});
});

export const getOneAddress = catchAsync(async (req, res, next) => {
	const { id: addressId } = req.params;
	const { role, id } = req.decodedToken;

	const address = await Address.findById(addressId);

	if (!address) {
		return next(new HandleError(`Address with ID ${addressId} not found.`, 404));
	}

	if (role !== 'admin' && role !== 'superAdmin' && id !== address.userId) {
		return next(
			new HandleError(
				`Access denied. You don't have permission to access this address. Are you trying to hack the system? 😉`,
				403
			)
		);
	}

	return res.status(200).json({
		success: true,
		data: { address },
	});
});

export const createAddress = catchAsync(async (req, res, next) => {
	const { role, id } = req.decodedToken;
	let newAddress;
	let createForId;

	if (role === 'superAdmin') {
		newAddress = await Address.create({ ...req?.body });
		createForId = req?.body?.userId;
	} else {
		newAddress = await Address.create({ ...req?.body, userId: id });
		createForId = id;
	}

	return res.status(200).json({
		success: true,
		message: `Address for user with ID: ${createForId} created successfully.`,
		data: { newAddress },
	});
});

export const updateAddress = catchAsync(async (req, res, next) => {
	const { id: addressId } = req.params;
	const { role, id } = req.decodedToken;
	const { userId, ...others } = req?.body;

	if (role !== 'admin' && role !== 'superAdmin' && id !== userId) {
		return next(
			new HandleError(
				`Access denied. You don't have permission to update this address. Sneaky, but not sneaky enough!`,
				403
			)
		);
	}

	const updatedAddress = await Address.findByIdAndUpdate(addressId, others, {
		new: true,
		runValidators: true,
	});

	if (!updatedAddress) {
		return next(new HandleError(`Address with ID ${addressId} not found.`, 404));
	}

	return res.status(200).json({
		success: true,
		message: `Address with ID ${addressId} updated successfully.`,
		data: { updatedAddress },
	});
});

export const deactiveAddress = catchAsync(async (req, res, next) => {
	const { id: addressId } = req.params;
	const { role, id } = req.decodedToken;
	const { userId } = req?.body;

	if (role !== 'admin' && role !== 'superAdmin' && id !== userId) {
		return next(
			new HandleError(
				`Access denied. Deactivating someone else's address? Nice try!`,
				403
			)
		);
	}

	const deactivatedAddress = await Address.findByIdAndUpdate(addressId, {
		isActive: false,
	});

	if (!deactivatedAddress) {
		return next(new HandleError(`Address with ID ${addressId} not found.`, 404));
	}

	return res.status(200).json({
		success: true,
		message: `Address with ID ${addressId} deactivated successfully.`,
		data: { deactivatedAddress },
	});
});

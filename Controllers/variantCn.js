import catchAsync from '../Utils/catchAsync.js';
import ApiFeatures from '../Utils/apiFeatures.js';
import HandleError from '../Utils/handleError.js';
import Variant from '../Models/variantMd.js';

export const getAllVariant = catchAsync(async (req, res, next) => {
	const variantFeatures = new ApiFeatures(Variant, req?.query) 
		.filters()
		.sort()
		.limitFields()
		.paginate()
		.populate();
	const variants = await variantFeatures.query;
	return res.status(200).json({
		success: true,
		data: { variants },
	});
});

export const getOneVariant = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const variant = await Variant.findById(id);
	if (!variant) {
		return next(new HandleError(`Variant with ID ${id} not found.`, 404));
	}
	return res.status(200).json({
		success: true,
		data: { variant },
	});
});

export const createVariant = catchAsync(async (req, res, next) => {
	const newVariant = await Variant.create(req?.body);
	return res.status(200).json({
		success: true,
		message: 'Variant created successfully.',
		data: { newVariant },
	});
});

export const updateVariant = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const updatedVariant = await Variant.findByIdAndUpdate(id, req?.body, {
		new: true,
		runValidators: true,
	});
	if (!updatedVariant) {
		return next(new HandleError(`Variant with ID ${id} not found.`, 404));
	}
	return res.status(200).json({
		success: true,
		message: `Variant with ID ${id} updated successfully.`,
		data: { updatedVariant },
	});
});

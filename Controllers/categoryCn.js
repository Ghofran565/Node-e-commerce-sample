import catchAsync from '../Utils/catchAsync.js';
import ApiFeatures from '../Utils/apiFeatures.js';
import Category from '../Models/categoryMd.js';

export const getAllCategory = catchAsync(async (req, res, next) => {
	const categoryFeatures = new ApiFeatures(Category, req.query)
		.filters()
		.sort()
		.limitFields()
		.paginate()
		.populate();
	const categories = await categoryFeatures.query;
	return res.status(200).json({
		success: true,
		data: categories,
	});
});

export const getOneCategory = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const category = await Category.findById(id);
	if (!category) {
		return next(new HandleError(`Category with ID ${id} not found.`, 404));
	}
	return res.status(200).json({
		success: true,
		data: category,
	});
});

export const createCategory = catchAsync(async (req, res, next) => {
	const newCategory = await Category.create(req.body);
	return res.status(200).json({
		success: true,
		message: 'Category created successfully.',
		data: newCategory,
	});
});

export const updateCategory = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!updatedCategory) {
		return next(new HandleError(`Category with ID ${id} not found.`, 404));
	}
	return res.status(200).json({
		success: true,
		message: `Category with ID ${id} updated successfully.`,
		data: updatedCategory,
	});
});

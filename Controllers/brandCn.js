import fs from 'fs';
import { __dirname } from '../app.js';
import catchAsync from '../Utils/catchAsync.js';
import ApiFeatures from '../Utils/apiFeatures.js';
import HandleError from '../Utils/handleError.js';
import Brand from '../Models/brandMd.js';
import Category from '../Models/categoryMd.js';

export const getAllBrand = catchAsync(async (req, res, next) => {
	const brandFeatures = new ApiFeatures(Brand, req?.query)
		.filters()
		.sort()
		.limitFields()
		.paginate()
		.populate();
	const brands = await brandFeatures.query;

	return res.status(200).json({
		success: true,
		data: { brands },
	});
});

export const getOneBrand = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const brand = await Brand.findById(id);

	if (!brand) {
		return next(new HandleError(`Brand with ID ${id} not found.`, 404));
	}

	return res.status(200).json({
		success: true,
		data: { brand },
	});
});

export const createBrand = catchAsync(async (req, res, next) => {
	const newBrand = await Brand.create(req?.body);
	for (let cId of newBrand?.categoryIds) {
		await Category.findByIdAndUpdate(cId, { $push: { brands: newBrand._id } });
	}

	return res.status(200).json({
		success: true,
		message: 'Brand created successfully.',
		data: { newBrand },
	});
});

export const updateBrand = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const brand = await Brand.findById(id);
	const { image = '', ...others } = req?.body;

	if (!brand) {
		return next(new HandleError(`Brand with ID ${id} not found.`, 404));
	}

	if (image && brand.image !== image) {
		if (brand.image) {
			fs.unlinkSync(`${__dirname}/public/${brand.image}`);
		}
	}

	const updateData = image ? { image, ...others } : others;

	const updatedBrand = await Brand.findByIdAndUpdate(id, updateData, {
		new: true,
		runValidators: true,
	});

	if (!updatedBrand) {
		return next(new HandleError(`Brand with ID ${id} not found.`, 404));
	}

	return res.status(200).json({
		success: true,
		message: `Brand with ID ${id} updated successfully.`,
		data: { updatedBrand },
	});
});

export const deleteBrand = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const deletedBrand = await Brand.findByIdAndDelete(id);

	if (!deletedBrand) {
		return next(new HandleError(`Brand with ID ${id} not found.`, 404));
	}

	if (deletedBrand?.image) {
		fs.unlinkSync(`${__dirname}/public/${deletedBrand.image}`);
	}

	for (let cId of deletedBrand?.categoryIds) {
		await Category.findByIdAndUpdate(cId, { $pull: { brands: deletedBrand._id } });
	}

	return res.status(200).json({
		success: true,
		message: `Brand with ID ${id} deleted successfully.`,
		data: { deletedBrand },
	});
});

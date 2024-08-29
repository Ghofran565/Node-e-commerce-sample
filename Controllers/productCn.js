import catchAsync from '../Utils/catchAsync.js';
import ApiFeatures from '../Utils/apiFeatures.js';
import HandleError from '../Utils/handleError.js';
import Product from '../Models/productMd.js';

export const getAllProduct = catchAsync(async (req, res, next) => {
	const query = { ...req.query, populate: 'ProductVariantIds' };
	const productFeatures = new ApiFeatures(Product, query)
		.filters()
		.sort()
		.limitFields()
		.paginate()
		.populate();
	const products = await productFeatures.query;
	return res.status(200).json({
		success: true,
		data: { products },
		resultCount: products.length,
	});
});

export const getOneProduct = catchAsync(async (req, res, next) => { //!conT 1:21:00  7th video
	const { id } = req.params;
	const product = await Product.findById(id).populate('ProductVariantIds');
	if (!product) {
		return next(new HandleError(`Product with ID ${id} not found.`, 404));
	}
	return res.status(200).json({
		success: true,
		data: { product },
	});
});

export const createProduct = catchAsync(async (req, res, next) => {
	const newProduct = await Product.create(req.body);
	return res.status(200).json({
		success: true,
		message: 'Product created successfully.',
		data: { newProduct },
	});
});

export const updateProduct = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const updatedProduct = await Product.findByIdAndUpdate(id, req?.body, {
		new: true,
		runValidators: true,
	});
	if (!updatedProduct) {
		return next(new HandleError(`Product with ID ${id} not found.`, 404));
	}
	return res.status(200).json({
		success: true,
		message: `Product with ID ${id} updated successfully.`,
		data: { updatedProduct },
	});
});

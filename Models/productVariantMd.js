import mongoose from 'mongoose';
const productVariantSchema = new mongoose.Schema(
	{
		variant: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Variant',
		},
		image: {
			type: String,
			required: [true, 'Image is required.'],
		},
		price: {
			type: Number,
			required: [true, 'Price is required.'],
		},
		discount: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		quantity: {
			type: Number,
			required: [true, 'Quantity is required.'],
		},
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
		},
		finalPrice: {
			type: Number,
		},
	},
	{ timestamps: true }
);

const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);
export default ProductVariant;

import mongoose from 'mongoose';
const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required.'],
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'Description is required.'],
			trim: true,
		},
		information: {
			type: [
				{
					name: String,
					value: String,
				},
			],
		},
		categoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		},
		brandId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Brand',
		},
		defaultVariant:[ {
			type: Number,
			default:0
		}], 
		productVariantIds:[ {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ProductVariant',
		}],
		isActive: {
			type:Boolean,
			default:false,
		},
	},
	{ timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;

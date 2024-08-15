import mongoose from 'mongoose';
const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required.'],
		},
		image: {
			type: String,
			required: [true, 'Image is required.'],
		},
		subCategory: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		},
		brands: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Brand',
			},
		],
	},
	{ timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;

import mongoose from 'mongoose';
const brandSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required.'],
		},
		image: {
			type: String,
		},
		categoryIds: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Category',
			},
		],
	},
	{ timestamps: true }
);

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;

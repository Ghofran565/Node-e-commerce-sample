import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: [true, 'content is required.'],
			trim: true,
			minLength: [5, 'Please enter 5 caracter in minimum'],
		},
		reply: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
		},
		isPublish: {
			type: Boolean,
			default: false,
		},
		rating: {
			type: Number,
			min: 0,
			max: 5,
		},
		isCustomer: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;

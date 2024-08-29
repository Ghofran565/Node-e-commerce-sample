import fs from 'fs';
import { __dirname } from '../app.js';
import catchAsync from '../Utils/catchAsync.js';
import ApiFeatures from '../Utils/apiFeatures.js';
import HandleError from '../Utils/handleError.js';
import Comment from '../Models/commentMd.js';

export const getAllComment = catchAsync(async (req, res, next) => {
	const commentFeatures = new ApiFeatures(Comment, req?.query)
		.filters()
		.sort()
		.limitFields()
		.paginate()
		.populate();
	const comments = await commentFeatures.query;
	return res.status(200).json({
		success: true,
		data: { comments },
	});
});

export const getOneComment = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const comment = await Comment.findById(id);
	if (!comment) {
		return next(new HandleError(`Comment with ID ${id} not found.`, 404));
	}
	return res.status(200).json({
		success: true,
		data: { comment },
	});
});

export const createComment = catchAsync(async (req, res, next) => {
	const { id } = req.decodedToken;
	const newComment = await Comment.create({ ...req?.body, userId: id });
	//* continue!! 9th session

	return res.status(200).json({
		success: true,
		message: 'Comment created successfully.',
		data: { newComment },
	});
});

export const updateComment = catchAsync(async (req, res, next) => {
	const { id: commentId } = req.params;
	const { role, id } = req.decodedToken;
	const comment = await Comment.findById(commentId);

	if (role !== 'superAdmin' && id !== comment?.userId) {
		return next(
			new HandleError(
				`Access denied. Only the original author or a superAdmin can edit this comment.`,
				403
			)
		);
	}

	const updatedComment = await Comment.findByIdAndUpdate(
		commentId,
		{ content: req?.body?.content || '' },
		{
			new: true,
			runValidators: true,
		}
	);
	if (!updatedComment) {
		return next(new HandleError(`Comment with ID ${commentId} not found.`, 404));
	}
	return res.status(200).json({
		success: true,
		message: `Comment with ID ${commentId} updated successfully.`,
		data: { updatedComment },
	});
});

export const deleteComment = catchAsync(async (req, res, next) => {
	const { id: commentId } = req.params;
	const { role, id } = req.decodedToken;
	const comment = await Comment.findById(commentId);

	if (role !== 'superAdmin' && id !== comment?.userId) {
		return next(
			new HandleError(
				`Access denied. Only the original author or a superAdmin can delete this comment.`,
				403
			)
		);
	}
	const deletedComment = await Comment.findByIdAndDelete(commentId);
	if (!deletedComment) {
		return next(new HandleError(`Comment with ID ${commentId} not found.`, 404));
	}

	return res.status(200).json({
		success: true,
		message: `Comment with ID ${commentId} deleted successfully.`,
		data: { deletedComment },
	});
});

export const togglePublish = catchAsync(async (req, res, next) => {
	const { id: commentId } = req.params;
	const comment = await Comment.findById(commentId);

	const updatedComment = await Comment.findByIdAndUpdate(
		commentId,
		{ isPublish: !comment?.isPublish },
		{
			new: true,
			runValidators: true,
		}
	);
	if (!updatedComment) {
		return next(new HandleError(`Comment with ID ${commentId} not found.`, 404));
	}
	return res.status(200).json({
		success: true,
		message: `Comment with ID ${commentId} ${updatedComment.isPublish ? 'published' : 'unpublished'} successfully.`,
		data: { updatedComment },
	});
});

export const getProductComment = catchAsync(async (req, res, next) => {
	let comments;
	const { id: productId } = req.params;
	const { role } = req.decodedToken;
	if (role === 'superAdmin' || role === 'admin') {
		comments = await Comment.find({ productId });
	} else {
		comments = await Comment.find({ productId, isPublish: true });
	}

	return res.status(200).json({
		success: true,
		data: { comments },
	});
});

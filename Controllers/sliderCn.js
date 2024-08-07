import fs from 'fs';
import { __dirname } from '../app.js';
import catchAsync from '../Utils/catchAsync.js';
import HandleError from '../Utils/handleError.js';
import Slider from '../Models/sliderMd.js';

export const getAllSlider = catchAsync(async (req, res, next) => {
	const sliders = await Slider.find(req.query);
	return res.status(200).json({
		success: true,
		data: { sliders },
	});
});

export const createSlider = catchAsync(async (req, res, next) => {
	const newSlider = await Slider.create(req.body);
	return res.status(200).json({
		success: true,
		message: 'Slider created successfully.',
		data: { newSlider },
	});
});

export const deleteSlider = catchAsync(async (req, res, next) => {
	//? is working right???
	const { id } = req.params;
	const deletedSlider = await Slider.findByIdAndDelete(id);
	if (!deletedSlider) {
		return next(new HandleError(`Slider with ID ${id} not found.`, 404));
	}
	fs.unlinkSync(`${__dirname}/public/${deletedSlider.image}`);
	return res.status(200).json({
		success: true,
		message: 'Slider deleted successfully.',
		data: { deletedSlider },
	});
});

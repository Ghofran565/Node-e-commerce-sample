import express from 'express';
import {
	createSlider,
	deleteSlider,
	getAllSlider,
} from '../Controllers/sliderCn.js';
import isAdmin from '../Middleware/isAdmin.js';

const router = express.Router();

router
	.route('/')
	.get(getAllSlider)
	.post(isAdmin(['admin']), createSlider);

router.route('/:id').delete(isAdmin(['admin']), deleteSlider);

export default router;

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
	.post(isAdmin(['superAdmin']), createSlider);

router.route('/:id').delete(isAdmin(['admin', 'superAdmin']), deleteSlider);

export default router;

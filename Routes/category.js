import express from 'express';
import {
	getAllCategory,
	getOneCategory,
	createCategory,
	updateCategory,
} from '../Controllers/categoryCn.js';
import isAdmin from '../Middleware/isAdmin.js';
import isLogin from '../Middleware/isLogin.js';

const router = express.Router();

router.route('/')
	.get(isLogin, getAllCategory)
	.post(isAdmin(['superAdmin']), createCategory);

router.route('/:id')
	.get(isAdmin(['admin', 'superAdmin']), getOneCategory)
	.patch(isAdmin(['superAdmin']), updateCategory);

export default router;

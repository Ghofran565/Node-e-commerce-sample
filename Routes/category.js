import express from 'express';
import {
	getAllCategory,
	getOneCategory,
	createCategory,
	updateCategory,
	deleteCategory,
} from '../Controllers/categoryCn.js';
import isAdmin from '../Middleware/isAdmin.js';
import isLogin from '../Middleware/isLogin.js';

const router = express.Router();

router.route('/')
	.get(isLogin, getAllCategory)
	.post(isAdmin(['admin']), createCategory);

router.route('/:id')
	.get(isAdmin(['admin']), getOneCategory)
	.patch(isAdmin(['admin']), updateCategory)
	.delete(isAdmin(['admin']), deleteCategory)


export default router;

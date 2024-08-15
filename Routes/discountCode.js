import express from 'express';
import {
	checkDiscountCode,
	createDiscountCode,
	getAllDiscountCode,
	getOneDiscountCode,
	updateDiscountCode,
} from '../Controllers/discountCodeCn.js';
import isAdmin from '../Middleware/isAdmin.js';
import isLogin from '../Middleware/isLogin.js';

const router = express.Router();

router
	.route('/')
	.get(isAdmin(['superAdmin']), getAllDiscountCode)
	.post(isAdmin(['superAdmin']), createDiscountCode);

router
	.route('/:id')
	.get(isAdmin(['superAdmin']), getOneDiscountCode)
	.patch(isAdmin(['superAdmin']), updateDiscountCode);

router.route('/check').get(isLogin, checkDiscountCode);

export default router;

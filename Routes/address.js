import express from 'express';
import {
	createAddress,
	deactiveAddress,
	getAllAddress,
	getOneAddress,
	updateAddress,
} from '../Controllers/addressCn.js';
import isLogin from '../Middleware/isLogin.js';

const router = express.Router();

router.route('/').get(isLogin, getAllAddress).post(isLogin, createAddress);

router
	.route('/:id')
	.get(isLogin, getOneAddress)
	.patch(isLogin, updateAddress)
	.delete(isLogin, deactiveAddress);

export default router;

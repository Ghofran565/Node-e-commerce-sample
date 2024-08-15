import express from 'express';
import {
	createComment,
	deleteComment,
	getAllComment,
	getOneComment,
	getProductComment,
	togglePublish,
	updateComment,
} from '../Controllers/commentCn.js';
import isAdmin from '../Middleware/isAdmin.js';
import isLogin from '../Middleware/isLogin.js';

const router = express.Router();

router
	.route('/')
	.get(isAdmin(['superAdmin']), getAllComment)
	.post(isLogin, createComment);

router
	.route('/:id')
	.get(isAdmin(['superAdmin']), getOneComment)
	.patch(isLogin, updateComment)
	.delete(isLogin, deleteComment);

router.route('/product-comment/:id').get(getProductComment);

router.route('/toggle-publish/:id').patch(isAdmin(['admin']), togglePublish);

export default router;

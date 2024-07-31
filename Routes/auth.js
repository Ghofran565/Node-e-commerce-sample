import express from 'express';
import {
	auth,
	changePassword,
	checkForgetPassword,
	forgetPassword,
	loginWithPassword,
	sendingEmailCode,
	verifyingEmailCode,
} from '../Controllers/authCn.js';
import isLogin from '../Middleware/isLogin.js';

const router = express.Router();

router.route('/').post(auth);
router.route('/login-password').post(loginWithPassword);
router.route('/send-code').post(sendingEmailCode);
router.route('/check-smtp').post(verifyingEmailCode);
router.route('/forget-password').post(forgetPassword);
router.route('/forget-password-check').post(checkForgetPassword);
router.route('/change-password').patch(isLogin, changePassword);

export default router;

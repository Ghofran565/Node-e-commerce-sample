import express from 'express';
import {
	auth,
	changePassword,
	checkOtp,
	checkOtpForgetPassword,
	forgetPassword,
	loginWithPassword,
	sendCode,
} from '../Controllers/authCn.js';
import { protect } from '../Middleware/authMidware.js';

const router = express.Router();

router.route('/').post(auth);
router.route('/login-password').post(loginWithPassword);
router.route('/send-code').post(sendCode);
router.route('/check-otp').post(checkOtp);
router.route('/forget-password').post(forgetPassword);
router.route('/forget-password-check').post(checkOtpForgetPassword);
router.route('/change-password').patch(protect, changePassword);

export default router;

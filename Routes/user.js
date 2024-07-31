import express from 'express';
import { getAllUser, getOneUser, updateUser } from '../Controllers/userCn.js';
import isAdmin from '../Middleware/isAdmin.js';
import isLogin from '../Middleware/isLogin.js';

const router = express.Router();

router.route('/').get(isAdmin(['superAdmin']), getAllUser);
router.route('/:id').get(isLogin, getOneUser).patch(isLogin, updateUser);

export default router;

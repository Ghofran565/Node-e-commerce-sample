import express from 'express';
import { createVariant, getAllVariant, getOneVariant, updateVariant } from '../Controllers/variantCn.js';
import isAdmin from '../Middleware/isAdmin.js';

const router = express.Router();

router.route('/')
	.get(isAdmin(['admin']), getAllVariant)
	.post(isAdmin(['admin']), createVariant);

router.route('/:id')
	.get(isAdmin(['admin']), getOneVariant)
	.patch(isAdmin(['admin']), updateVariant)


export default router;

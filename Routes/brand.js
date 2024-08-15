import express from 'express';
import { createBrand, deleteBrand, getAllBrand, getOneBrand, updateBrand } from '../Controllers/brandCn.js';
import isAdmin from '../Middleware/isAdmin.js';

const router = express.Router();

router.route('/')
	.get(getAllBrand)
	.post(isAdmin(['admin']), createBrand);

router.route('/:id')
	.get(isAdmin(['admin']), getOneBrand)
	.patch(isAdmin(['admin']), updateBrand)
	.delete(isAdmin(['admin']), deleteBrand)


export default router;

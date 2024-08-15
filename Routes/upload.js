import express from 'express';
import upload from '../Utils/UploadFile.js';
import isAdmin from '../Middleware/isAdmin.js';
import { deleteFile, uploadFile } from '../Controllers/uploadCn.js';

const router = express.Router();

router
	.route('/')
	.post(isAdmin(['admin']), upload.single('file'), uploadFile)
	.delete(isAdmin(['admin']), deleteFile);

export default router;

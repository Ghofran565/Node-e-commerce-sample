/// required imports \\\
import express from 'express';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';

/// custom imports \\\
import uploadRouter from './Routes/upload.js';
import addressRouter from './Routes/address.js';
import authRouter from './Routes/auth.js';
import userRouter from './Routes/user.js';
import cartRouter from './Routes/cart.js';
import categoryRouter from './Routes/category.js';
import commentRouter from './Routes/comment.js';
import orderHistoryRouter from './Routes/orderHistory.js';
import productRouter from './Routes/product.js';
import sliderRouter from './Routes/slider.js';
import discountCodeRouter from './Routes/discountCode.js';
import brandRouter from './Routes/brand.js';
import catchError from './Utils/catchError.js';
import HandleError from './Utils/handleError.js';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

/// required app uses \\\
const app = express();
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors()); //fill with front local path

/// custom app uses \\\
app.use('/api/upload', uploadRouter);
app.use('/api/address', addressRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/category', categoryRouter);
app.use('/api/comment', commentRouter);
app.use('/api/history', orderHistoryRouter);
app.use('/api/product', productRouter);
app.use('/api/slider', sliderRouter);
app.use('/api/discount', discountCodeRouter);
app.use('/api/brand', brandRouter);

app.use('*', (req, res, next) => {
	return next(new HandleError('Invalid route', 404));
});

/// catching every error automaticly \\\
app.use(catchError);

export default app;

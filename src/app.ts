import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/err';
import { ExtendedRequest } from './middlewares/hardcodeauth';
import unknownUrl from './controllers/unknownurl';
import { rateLimit } from 'express-rate-limit'

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
mongoose.connect(DB_URL);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
})

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req: ExtendedRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '682df2acc9207ccfb7f8a4fb' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorHandler);

app.use('*', unknownUrl);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { Err } from '@/types/global.types';
import indexRouter from './routes/index';
import usersRouter from './routes/users';

const app = express();

// view engine setup
app.set('views', join(__dirname, '..', 'src', 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('json spaces', 2);

app.use(express.static(join(__dirname, '..', 'src', 'public')));

app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: Err, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;

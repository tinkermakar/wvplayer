import express, { Request, Response } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import hbs from 'hbs';
import { Err } from './lib/types/types';
import { frontRouter } from './routes/front';
import { apiRouter } from './routes/api';
import { loginRouter } from './routes/login';
import { config } from './lib/config/config';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();

// view engine setup
app.set('views', join(__dirname, '..', 'src', 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(join(__dirname, '..', 'src', 'views', 'partials'), console.error);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(join(__dirname, '..', 'src', 'public'))); // TODO move all to dist by converting to TS
app.use(express.static(join(__dirname, '..', 'dist', 'public')));

app.get('/favicon.ico', (_req, res) => res.status(204));
app.use('/login', loginRouter);
app.use(authMiddleware);
app.use('/api', apiRouter);
app.use('/', frontRouter);

// catch 404 and forward to error handler
app.use((_req, _res, next) => next({ status: 404 }));

// error handler
app.use((err: Err, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(config.port, async () => console.info(`🚀 Listening on port ${config.port}\n`));

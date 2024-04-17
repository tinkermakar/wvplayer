import express, { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import hbs from 'hbs';
import { frontRouter } from './routes/front';
import { apiRouter } from './routes/api';
import { loginRouter } from './routes/login';
import { config } from './lib/config/config';
import { authMiddleware } from './middleware/authMiddleware';
import { Problem } from './lib/utils/errorHandling';

const app = express();

// view engine setup
app.set('views', join(__dirname, '..', 'src', 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(join(__dirname, '..', 'src', 'views', 'partials'), console.error);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(join(__dirname, '..', 'src', 'public')));
app.use(express.static(join(__dirname, '..', 'dist', 'public')));

app.get('/favicon.ico', (_req, res) => res.status(204));
app.use('/login', loginRouter);
app.use(authMiddleware);
app.use('/api', apiRouter);
app.use('/', frontRouter);

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Problem, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(error);
  const { message, status, stack } = error;
  res.status(status || 500);
  if (res.locals.isApiError) res.json({ message, status, stack });
  else res.render('error', { message, status, stack });
});

app.listen(config.port, async () => console.info(`🚀 Listening on port ${config.port}\n`));

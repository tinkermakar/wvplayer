import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import hbs from 'hbs';
import { frontRouter } from './routes/front.ts';
import { apiRouter } from './routes/api.ts';
import { loginRouter } from './routes/login.ts';
import { config } from './lib/config/config.ts';
import { authMiddleware } from './middleware/authMiddleware.ts';
import type { Problem } from './lib/utils/errorHandling.ts';

export const app = express();

// view engine setup
app.set('views', join(import.meta.dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(join(import.meta.dirname, 'views', 'partials'), console.error);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/scripts/player.js', (_req, res) => {
  const source = readFileSync(join(import.meta.dirname, 'public/scripts/player.ts'), 'utf8');
  res.type('js').send(stripTypeScriptTypes(source));
});
app.use(express.static(join(import.meta.dirname, 'public')));

app.get('/favicon.ico', (_req, res) => res.sendStatus(204));
app.use('/login', loginRouter);
app.use(authMiddleware);
app.use('/api', apiRouter);
app.use('/', frontRouter);

// Error handler
app.use((error: Problem, _req: Request, res: Response, next: NextFunction): void => {
  if (res.headersSent) return next(error);
  console.error(error);
  if (error.headers) res.set(error.headers);
  const { message, status, stack } = error;
  res.status(status || 500);
  if (res.locals.isApiError) res.json({ message, status, stack });
  else res.render('error', { message, status, stack });
});

export const server = app.listen(config.port, async () =>
  console.info(`🚀 Listening on port ${config.port}\n`),
);

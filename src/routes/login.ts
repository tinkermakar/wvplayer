import { Router } from 'express';
import { logoutHandler } from '../handlers/auth/logoutHandler.ts';
import { loginGetHandler } from '../handlers/auth/loginGetHandler.ts';
import { loginPostHandler } from '../handlers/auth/loginPostHandler.ts';

export const loginRouter = Router();

loginRouter.post('/logout', logoutHandler).get('/', loginGetHandler).post('/', loginPostHandler);

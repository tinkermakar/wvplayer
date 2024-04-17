import { Router } from 'express';
import { logoutHandler } from '../handlers/auth/logoutHandler';
import { loginGetHandler } from '../handlers/auth/loginGetHandler';
import { loginPostHandler } from '../handlers/auth/loginPostHandler';

export const loginRouter = Router();

loginRouter.post('/logout', logoutHandler).get('/', loginGetHandler).post('/', loginPostHandler);

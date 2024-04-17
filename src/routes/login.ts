import { Router } from 'express';
import { config } from '../lib/config/config';
import { cryptoService } from '../services/cryptoService';

export const loginRouter = Router();

loginRouter.post('/logout', async (_req, res) => {
  res.clearCookie('wvplayerSession');
  return res.redirect('/login');
});

loginRouter.get('/', async (req, res) => {
  const { redirect } = req.query;
  res.render('login', { redirect });
});

loginRouter.post('/', async (req, res) => {
  const { username, password, redirect, remember } = req.body;

  // const existingCookie = req.cookies?.wvplayerSession;
  const isPasswordCorrect = username === config.username && password === config.password;
  if (!isPasswordCorrect) return res.redirect('/login');

  const cookiePayload = cryptoService.encrypt(`${username}---${Math.random()}`);

  res.cookie('wvplayerSession', cookiePayload, { httpOnly: true, maxAge: remember && 8.64e7 });
  res.redirect(redirect || '/');
});

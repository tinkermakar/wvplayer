import { Request, Response, NextFunction } from 'express';
import { config } from '../../lib/config/config';
import { cryptoService } from '../../services/cryptoService';

export const loginPostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, redirect, remember } = req.body;

    const isPasswordCorrect = username === config.username && password === config.password;
    if (!isPasswordCorrect) return res.redirect('/login');

    const cookiePayload = cryptoService.generateToken(username);

    res.cookie('wvplayerSession', cookiePayload, { httpOnly: true, maxAge: remember && 8.64e7 });
    res.redirect(redirect || '/');
  } catch (err) {
    next(err);
  }
};

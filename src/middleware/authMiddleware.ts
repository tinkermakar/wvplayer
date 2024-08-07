import { NextFunction, Request, Response } from 'express';
import { cryptoService } from '../services/cryptoService';
import { config } from '../lib/config/config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const cookieValue = req.cookies.wvplayerSession;

  const isChromecast = req.headers['user-agent']?.includes('CrKey');
  const chromecastToken = isChromecast && req.query.token?.toString();

  const token = cookieValue ?? chromecastToken;

  const params = new URLSearchParams();
  params.set('redirect', req.path);

  const redirectUrl = `/login?${params.toString()}`;

  if (!token) return res.redirect(redirectUrl);

  const decrypted = cryptoService.decrypt(token);
  const [username, tokenDateStr] = decrypted?.split('&') ?? [];

  if (!username || !tokenDateStr || username !== config.username) {
    res.clearCookie('wvplayerSession');
    return res.redirect(redirectUrl);
  }

  if (chromecastToken) {
    const now = new Date().getTime();
    const tokenDate = new Date(tokenDateStr).getTime();
    const expiryPeriod = 3 * 60 * 60 * 1000; // 3 hours

    if (now - tokenDate > expiryPeriod) {
      res.clearCookie('wvplayerSession');
      return res.sendStatus(440);
    }
  }
  next();
};

import { Request, Response, NextFunction } from 'express';

export const logoutHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('wvplayerSession');
    return res.redirect('/login');
  } catch (err) {
    next(err);
  }
};

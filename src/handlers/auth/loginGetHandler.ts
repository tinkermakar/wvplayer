import { Request, Response, NextFunction } from 'express';

export const loginGetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { redirect } = req.query;
    res.render('login', { redirect });
  } catch (err) {
    next(err);
  }
};

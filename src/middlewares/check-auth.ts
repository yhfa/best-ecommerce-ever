import { Response, Request, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') return next();
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error('Authentication failed!');
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayload;

    req['userId'] = decodedToken.id;
    next();
  } catch (err) {
    console.error('Error 💥 ', err);
    return res
      .status(401)
      .json({ status: 'error', message: 'Invaild token. Please log in again' });
  }
}

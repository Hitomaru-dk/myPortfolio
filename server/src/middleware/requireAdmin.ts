import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export interface AdminRequest extends Request {
  isAdmin?: boolean;
}

export function requireAdmin(req: AdminRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.auth_token;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    if (decoded.role !== 'admin') {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    req.isAdmin = true;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

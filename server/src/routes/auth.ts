import { Router, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// POST /api/auth/login
router.post('/login', (req: Request, res: Response): void => {
  const { password } = req.body;

  if (!password || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  res.json({ success: true });
});

// GET /api/auth/me
router.get('/me', (req: Request, res: Response): void => {
  const token = req.cookies?.auth_token;

  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    if (decoded.role !== 'admin') {
      res.status(401).json({ error: 'Not authorized' });
      return;
    }
    res.json({ isAdmin: true });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response): void => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
  });
  res.json({ success: true });
});

export default router;

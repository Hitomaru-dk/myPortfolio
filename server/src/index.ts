import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import profileRoutes from './routes/profile.js';

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(url => url.trim().replace(/\/+$/, ''));

// โดเมนที่อนุญาตตามค่าเริ่มต้น (สำหรับการรันโลคอลและ Github Pages ของผู้ใช้)
const defaultAllowed = [
  'http://localhost:5173',
  'https://hydra07188.github.io'
];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // อนุญาตหากไม่มี origin (เช่น หลังบ้านเรียกกันเอง หรือเครื่องมือทดสอบอื่นๆ)
      if (!origin) {
        return callback(null, true);
      }
      
      const cleanOrigin = origin.replace(/\/+$/, '');
      const isAllowed = 
        allowedOrigins.includes(cleanOrigin) || 
        defaultAllowed.some(allowed => cleanOrigin.startsWith(allowed));
        
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser(process.env.JWT_SECRET || 'dev-secret'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// เฉพาะการรันในเครื่อง (Local Development) ให้เปิด port ฟังปกติ
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[server] running on http://localhost:${PORT}`);
  });
}

export default app;

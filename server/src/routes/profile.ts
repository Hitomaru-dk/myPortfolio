import { Router, type Request, type Response } from 'express';
import prisma from '../lib/prisma.js';
import { requireAdmin, type AdminRequest } from '../middleware/requireAdmin.js';

const router = Router();
const PROFILE_ID = 'single-profile';

// GET /api/profile — ดึงข้อมูลโปรไฟล์ทั้งหมด (เปิดเผยสาธารณะ)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    let profile = await prisma.profile.findUnique({
      where: { id: PROFILE_ID },
    });

    // ถ้าไม่มีข้อมูล ให้สร้างข้อมูลเริ่มต้นขึ้นมา
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          id: PROFILE_ID,
          certifications: [
            { name: 'Web Development Certificate', issuer: 'Example Academy', year: '2024' },
            { name: 'UX/UI Design Fundamentals', issuer: 'Example Institute', year: '2023' }
          ]
        },
      });
    }

    res.json(profile);
  } catch (err: any) {
    console.error('Failed to fetch profile:', err);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      message: err.message || String(err),
      stack: err.stack
    });
  }
});

// PUT /api/profile — อัปเดตข้อมูลโปรไฟล์ (เฉพาะ Admin เท่านั้น)
router.put('/', requireAdmin, async (req: AdminRequest, res: Response): Promise<void> => {
  const {
    email,
    phone,
    birthdayTh,
    birthdayEn,
    avatarUrl,
    githubUrl,
    lineUrl,
    instagramUrl,
    facebookUrl,
    aboutTextTh,
    aboutTextEn,
    skills,
    tools,
    certifications,
  } = req.body;

  try {
    // มั่นใจว่า certifications ถูกส่งไปเป็นออบเจ็กต์/อาร์เรย์จริงสำหรับ Prisma Json type
    let finalCerts = certifications;
    if (typeof certifications === 'string') {
      try {
        finalCerts = JSON.parse(certifications);
      } catch {
        finalCerts = [];
      }
    }

    const profile = await prisma.profile.upsert({
      where: { id: PROFILE_ID },
      update: {
        email,
        phone,
        birthdayTh,
        birthdayEn,
        avatarUrl,
        githubUrl,
        lineUrl,
        instagramUrl,
        facebookUrl,
        aboutTextTh,
        aboutTextEn,
        skills: Array.isArray(skills) ? skills : [],
        tools: Array.isArray(tools) ? tools : [],
        certifications: finalCerts || [],
      },
      create: {
        id: PROFILE_ID,
        email,
        phone,
        birthdayTh,
        birthdayEn,
        avatarUrl,
        githubUrl,
        lineUrl,
        instagramUrl,
        facebookUrl,
        aboutTextTh,
        aboutTextEn,
        skills: Array.isArray(skills) ? skills : [],
        tools: Array.isArray(tools) ? tools : [],
        certifications: finalCerts || [],
      },
    });

    res.json(profile);
  } catch (err) {
    console.error('SERVER PROFILE UPDATE ERROR DETECTED:', err);
    res.status(500).json({ error: 'Failed to update profile', details: String(err) });
  }
});

export default router;

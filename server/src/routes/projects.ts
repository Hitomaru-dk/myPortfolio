import { Router, type Request, type Response } from 'express';
import prisma from '../lib/prisma.js';
import { requireAdmin, type AdminRequest } from '../middleware/requireAdmin.js';

const router = Router();

// GET /api/projects — public, list all projects
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id — public, single project
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json(project);
  } catch (err) {
    console.error('Failed to fetch project:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/projects — admin only, create project
router.post('/', requireAdmin, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const { title, description, techStack, imageUrl, liveUrl, repoUrl } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: 'Title and description are required' });
      return;
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        techStack: Array.isArray(techStack) ? techStack : [],
        imageUrl: imageUrl || null,
        liveUrl: liveUrl || null,
        repoUrl: repoUrl || null,
      },
    });

    res.status(201).json(project);
  } catch (err) {
    console.error('Failed to create project:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// DELETE /api/projects/:id — admin only, delete project
router.delete('/:id', requireAdmin, async (req: AdminRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;

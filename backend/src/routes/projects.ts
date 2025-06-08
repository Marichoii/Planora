import { Router } from 'express';
import { getProjects } from '../controllers/projectController';

const router = Router();

router.get('/:userId', getProjects);

export default router; 
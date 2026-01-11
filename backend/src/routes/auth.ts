import { Router } from 'express';
import { login, getProfile } from '../controllers/auth';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/profile', authenticate, getProfile);

export default router;

import { Router } from 'express';
import authRouter from './auth.routes.js';
import resourceRouter from './resource.routes.js';
import adminRouter from './admin.routes.js';

const router = Router();

router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

router.use('/auth', authRouter);
router.use('/resources', resourceRouter);
router.use('/admin', adminRouter);

export default router;

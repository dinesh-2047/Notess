import { Router } from 'express';
import { getAdminStats, listUsers, updateUser } from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate, authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/users', listUsers);
router.patch('/users/:id', updateUser);

export default router;
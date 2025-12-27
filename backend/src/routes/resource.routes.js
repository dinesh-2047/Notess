import { Router } from 'express';

import {
  createResource,
  deleteResource,
  downloadResource,
  getResource,
  listResources,
  updateResource,
} from '../controllers/resource.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';
import { uploadResourceFiles } from '../middlewares/uploadMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  resourceCreateSchema,
  resourceFilterSchema,
  resourceUpdateSchema,
} from '../validators/resource.schema.js';

const router = Router();

router.get('/', validateRequest(resourceFilterSchema, 'query'), listResources);
router.get('/:id/download', authenticate, downloadResource);
router.get('/:slug', getResource);

router.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  uploadResourceFiles,
  validateRequest(resourceCreateSchema),
  createResource,
);

router.patch(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  uploadResourceFiles,
  validateRequest(resourceUpdateSchema),
  updateResource,
);

router.delete('/:id', authenticate, authorizeRoles('admin'), deleteResource);

export default router;

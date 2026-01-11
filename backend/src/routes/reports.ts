import { Router } from 'express';
import {
  createReport,
  getReports,
  getReportById,
  getDashboardMetrics,
  getCategories,
  getSites,
} from '../controllers/reports';
import { authenticate } from '../middleware/auth';
import { tenantContext } from '../middleware/tenant';

const router = Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(tenantContext);

// Reports
router.post('/reports', createReport);
router.get('/reports', getReports);
router.get('/reports/:id', getReportById);

// Dashboard
router.get('/dashboard/metrics', getDashboardMetrics);

// Lookup data
router.get('/categories', getCategories);
router.get('/sites', getSites);

export default router;

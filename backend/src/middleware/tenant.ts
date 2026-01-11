import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to ensure all database queries are filtered by tenant_id
 * This must be applied after authentication middleware
 */
export const tenantContext = (req: Request, res: Response, next: NextFunction) => {
  if (!req.tenantId) {
    return res.status(403).json({ error: 'Tenant context required' });
  }
  next();
};

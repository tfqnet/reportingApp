import { Request, Response } from 'express';
import prisma from '../db';
import { z } from 'zod';

const createReportSchema = z.object({
  type: z.enum(['unsafe_act', 'unsafe_condition', 'safety_excellence']),
  title: z.string().min(1),
  description: z.string().min(1),
  siteId: z.string().uuid().optional(),
  locationDescription: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  immediateActionTaken: z.string().optional(),
  severity: z.number().min(1).max(5).optional(),
  likelihood: z.number().min(1).max(5).optional(),
  exposure: z.number().min(1).max(5).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const createReport = async (req: Request, res: Response) => {
  try {
    const data = createReportSchema.parse(req.body);
    const { tenantId, userId } = req.user!;

    // Get tenant slug for report number
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { slug: true },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Get first site if not provided
    let siteId = data.siteId;
    if (!siteId) {
      const site = await prisma.site.findFirst({
        where: { tenantId, isActive: true },
        select: { id: true },
      });
      if (!site) {
        return res.status(400).json({ error: 'No active site found' });
      }
      siteId = site.id;
    }

    // Generate report number
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    const reportNumber = `${tenant.slug.toUpperCase()}-SR-${year}-${timestamp}`;

    // Create report
    const report = await prisma.report.create({
      data: {
        tenantId,
        reportNumber,
        submittedBy: userId,
        siteId,
        type: data.type,
        title: data.title,
        description: data.description,
        locationDescription: data.locationDescription,
        categoryId: data.categoryId,
        immediateActionTaken: data.immediateActionTaken,
        severity: data.severity,
        likelihood: data.likelihood,
        exposure: data.exposure,
        latitude: data.latitude,
        longitude: data.longitude,
        status: 'open',
      },
      include: {
        submitter: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        site: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    res.status(201).json({
      data: report,
      message: 'Report created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user!;
    const { status, type, siteId } = req.query;

    const where: any = { tenantId };
    if (status) where.status = status as string;
    if (type) where.type = type as string;
    if (siteId) where.siteId = siteId as string;

    const reports = await prisma.report.findMany({
      where,
      include: {
        submitter: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        site: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    res.json({ data: reports });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user!;
    const { id } = req.params;

    const report = await prisma.report.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        submitter: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        site: {
          select: {
            id: true,
            name: true,
            code: true,
            address: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            description: true,
          },
        },
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        closer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        media: true,
        actions: {
          include: {
            assignee: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ data: report });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user!;

    // Get current month start
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total reports this month
    const totalReports = await prisma.report.count({
      where: {
        tenantId,
        submittedAt: {
          gte: monthStart,
        },
      },
    });

    // Open reports
    const openReports = await prisma.report.count({
      where: {
        tenantId,
        status: {
          in: ['open', 'in_progress'],
        },
      },
    });

    // Unsafe acts
    const unsafeActs = await prisma.report.count({
      where: {
        tenantId,
        type: 'unsafe_act',
        submittedAt: {
          gte: monthStart,
        },
      },
    });

    // Unsafe conditions
    const unsafeConditions = await prisma.report.count({
      where: {
        tenantId,
        type: 'unsafe_condition',
        submittedAt: {
          gte: monthStart,
        },
      },
    });

    // Safety excellence
    const safetyExcellence = await prisma.report.count({
      where: {
        tenantId,
        type: 'safety_excellence',
        submittedAt: {
          gte: monthStart,
        },
      },
    });

    // Recent reports
    const recentReports = await prisma.report.findMany({
      where: { tenantId },
      include: {
        submitter: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        site: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
      take: 10,
    });

    res.json({
      data: {
        totalReports,
        openReports,
        unsafeActs,
        unsafeConditions,
        safetyExcellence,
        recentReports,
      },
    });
  } catch (error) {
    console.error('Get dashboard metrics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user!;

    const categories = await prisma.category.findMany({
      where: {
        tenantId,
        isActive: true,
      },
      orderBy: [
        { type: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    res.json({ data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSites = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.user!;

    const sites = await prisma.site.findMany({
      where: {
        tenantId,
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({ data: sites });
  } catch (error) {
    console.error('Get sites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

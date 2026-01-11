import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create demo tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Demo Construction Corp',
      slug: 'demo-construction',
      industry: 'construction',
      settings: JSON.stringify({
        branding: {
          primaryColor: '#1976d2',
          companyName: 'Demo Construction Corp',
        },
        workflow: {
          requireSupervisorApproval: true,
          autoAssignByLocation: false,
        },
      }),
      subscriptionPlan: 'pro',
      maxUsers: 50,
      isActive: true,
    },
  });

  console.log('✅ Created tenant:', tenant.name);

  // Create demo site
  const site = await prisma.site.create({
    data: {
      tenantId: tenant.id,
      name: 'Main Construction Site',
      code: 'SITE-001',
      address: '123 Build Street, Construction City',
      latitude: 1.3521,
      longitude: 103.8198,
      isActive: true,
    },
  });

  console.log('✅ Created site:', site.name);

  // Create users with different roles
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'admin@demo.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      department: 'Management',
      isActive: true,
    },
  });

  const safetyOfficer = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'safety@demo.com',
      passwordHash,
      firstName: 'Safety',
      lastName: 'Officer',
      role: 'safety_officer',
      department: 'HSE',
      isActive: true,
    },
  });

  const supervisor = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'supervisor@demo.com',
      passwordHash,
      firstName: 'John',
      lastName: 'Supervisor',
      role: 'supervisor',
      department: 'Operations',
      isActive: true,
    },
  });

  const worker = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'worker@demo.com',
      passwordHash,
      firstName: 'Mike',
      lastName: 'Worker',
      role: 'field_worker',
      department: 'Construction',
      isActive: true,
    },
  });

  console.log('✅ Created users: admin, safety officer, supervisor, worker');

  // Link users to site
  await prisma.userSite.createMany({
    data: [
      { userId: admin.id, siteId: site.id },
      { userId: safetyOfficer.id, siteId: site.id },
      { userId: supervisor.id, siteId: site.id },
      { userId: worker.id, siteId: site.id },
    ],
  });

  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      // Unsafe Acts
      {
        tenantId: tenant.id,
        name: 'PPE Not Worn',
        type: 'unsafe_act',
        description: 'Personal protective equipment not being used',
        sortOrder: 1,
      },
      {
        tenantId: tenant.id,
        name: 'Working at Height Without Harness',
        type: 'unsafe_act',
        description: 'Working at elevated positions without fall protection',
        sortOrder: 2,
      },
      {
        tenantId: tenant.id,
        name: 'Improper Tool Use',
        type: 'unsafe_act',
        description: 'Using tools incorrectly or for unintended purposes',
        sortOrder: 3,
      },
      // Unsafe Conditions
      {
        tenantId: tenant.id,
        name: 'Slip/Trip Hazard',
        type: 'unsafe_condition',
        description: 'Conditions that could cause slips, trips, or falls',
        sortOrder: 1,
      },
      {
        tenantId: tenant.id,
        name: 'Unsecured Scaffolding',
        type: 'unsafe_condition',
        description: 'Scaffolding that is not properly secured or stable',
        sortOrder: 2,
      },
      {
        tenantId: tenant.id,
        name: 'Electrical Hazard',
        type: 'unsafe_condition',
        description: 'Exposed wiring, damaged equipment, or electrical risks',
        sortOrder: 3,
      },
      {
        tenantId: tenant.id,
        name: 'Housekeeping Issue',
        type: 'unsafe_condition',
        description: 'Poor housekeeping creating safety hazards',
        sortOrder: 4,
      },
    ],
  });

  console.log('✅ Created categories:', categories.count);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Admin:          admin@demo.com / password123');
  console.log('   Safety Officer: safety@demo.com / password123');
  console.log('   Supervisor:     supervisor@demo.com / password123');
  console.log('   Worker:         worker@demo.com / password123');
  console.log('\n   Tenant Slug:    demo-construction');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

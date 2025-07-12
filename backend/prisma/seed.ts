import { PrismaClient, UserRole, ComplaintStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create test users
  const consumer = await prisma.user.upsert({
    where: { email: 'consumer@example.com' },
    update: {},
    create: {
      email: 'consumer@example.com',
      password: hashedPassword,
      fullName: 'John Consumer',
      role: UserRole.CONSUMER,
    },
  });

  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@example.com' },
    update: {},
    create: {
      email: 'reviewer@example.com',
      password: hashedPassword,
      fullName: 'Jane Reviewer',
      role: UserRole.REVIEWER,
    },
  });

  // Create test complaints
  const complaint1 = await prisma.complaint.create({
    data: {
      title: 'Internet Connection Issue',
      description: 'My internet connection has been very slow for the past week. Please help resolve this issue.',
      status: ComplaintStatus.PENDING,
      consumerId: consumer.id,
    },
  });

  const complaint2 = await prisma.complaint.create({
    data: {
      title: 'Billing Error',
      description: 'I was charged twice for the same service. Please correct this billing error.',
      status: ComplaintStatus.IN_PROGRESS,
      consumerId: consumer.id,
    },
  });

  const complaint3 = await prisma.complaint.create({
    data: {
      title: 'Service Outage',
      description: 'Complete service outage in my area since yesterday. When will it be fixed?',
      status: ComplaintStatus.RESOLVED,
      consumerId: consumer.id,
    },
  });

  // Create test comments
  await prisma.comment.create({
    data: {
      content: 'Thank you for reporting this issue. We are investigating.',
      complaintId: complaint1.id,
      userId: reviewer.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'We have identified the issue and are working on a fix. Expected resolution in 24 hours.',
      complaintId: complaint1.id,
      userId: reviewer.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Billing error has been corrected. Refund will be processed within 3-5 business days.',
      complaintId: complaint2.id,
      userId: reviewer.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Service has been restored. Please let us know if you still face any issues.',
      complaintId: complaint3.id,
      userId: reviewer.id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📝 Test Users:');
  console.log('   Consumer: consumer@example.com / password123');
  console.log('   Reviewer: reviewer@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
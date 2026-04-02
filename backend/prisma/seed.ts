import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });


async function main() {
   console.log('🌱 Seeding database...');

   console.log('--- Seeding Admin ---');
   const adminEmail = process.env.ADMIN_EMAIL || 'admin@roktolagbe.com';
   const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

   const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
   if (!existingAdmin) {
      await prisma.user.create({
         data: {
            email: adminEmail,
            passwordHash: await bcrypt.hash(adminPassword, 12),
            role: 'ADMIN',
            isVerified: true,
            isActive: true,
         },
      });
      console.log(`✅ Admin created: ${adminEmail}`);
   }


   // Seed Badges (Gamification)
   console.log('--- Seeding Badges ---');
   const badges = [
      {
         name: 'Hero\'s First Blood',
         description: 'Awarded for your very first life-saving blood donation.',
         icon: 'HeroFirstBlood',
         category: 'Milestone'
      },
      {
         name: 'Life Saver',
         description: 'Awarded for completing 5 successful blood donations.',
         icon: 'LifeSaver',
         category: 'Milestone'
      },
      {
         name: 'Centurion',
         description: 'Awarded for reaching 100 contribution points.',
         icon: 'Centurion',
         category: 'Special'
      },
      {
         name: 'Community Guardian',
         description: 'Associated with 3 or more local blood networks.',
         icon: 'CommunityGuardian',
         category: 'Community'
      }
   ];

   for (const b of badges) {
      const existing = await prisma.badge.findFirst({ where: { name: b.name } });
      if (!existing) {
         await prisma.badge.create({ data: b });
         console.log(`✅ Created Badge: ${b.name}`);
      }
   }



   console.log('✅ Seeding complete!');
}

main()
   .catch((e) => {
      console.error('❌ Seed failed:', e);
      if (e.cause) console.error('🔍 Cause:', e.cause);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
   });

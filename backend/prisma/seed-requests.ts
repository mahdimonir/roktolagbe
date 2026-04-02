import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🧪 Seeding 5 Dummy Blood Requests...');

  const manager = await prisma.managerProfile.findFirst();
  const managerId = manager?.id || null;

  const requests = [
    {
      bloodGroup: 'A_POS',
      units: 2,
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Dhanmondi',
      urgency: 'CRITICAL',
      deadline: new Date(Date.now() + 86400000), // 1 day from now
      patientCondition: 'Emergency Surgery',
      hemoglobin: '7.5',
      hospitalName: 'Dhaka Medical College Hospital',
      detailedAddress: 'Room 302, Ward 5, Block B',
      status: 'OPEN',
      contactPhone: '01711223344',
      isEmergency: true,
      managerId: managerId,
    },
    {
      bloodGroup: 'B_NEG',
      units: 1,
      division: 'Chittagong',
      district: 'Chittagong',
      thana: 'Panchlaish',
      urgency: 'HIGH',
      deadline: new Date(Date.now() + 172800000), // 2 days from now
      patientCondition: 'Thalassemia patient',
      hemoglobin: '6.2',
      hospitalName: 'Chittagong Medical College',
      detailedAddress: 'Red Crescent Unit',
      status: 'OPEN',
      contactPhone: '01855667788',
      isEmergency: false,
      managerId: managerId,
    },
    {
      bloodGroup: 'O_POS',
      units: 3,
      division: 'Sylhet',
      district: 'Sylhet',
      thana: 'Zindabazar',
      urgency: 'NORMAL',
      deadline: new Date(Date.now() + 259200000), // 3 days from now
      patientCondition: 'Bone Marrow Transplant',
      hemoglobin: '9.0',
      hospitalName: 'Sylhet MAG Osmani Medical',
      detailedAddress: 'Hematology Dept',
      status: 'OPEN',
      contactPhone: '01999888777',
      isEmergency: false,
      managerId: null, // Anonymous request
    },
    {
      bloodGroup: 'AB_NEG',
      units: 1,
      division: 'Rajshahi',
      district: 'Rajshahi',
      thana: 'Boalia',
      urgency: 'CRITICAL',
      deadline: new Date(Date.now() + 43200000), // 12 hours from now
      patientCondition: 'Accident Trauma',
      hemoglobin: '5.8',
      hospitalName: 'Rajshahi Medical College',
      detailedAddress: 'ICU Bed 4',
      status: 'OPEN',
      contactPhone: '01666555444',
      isEmergency: true,
      managerId: null, // Anonymous request
    },
    {
      bloodGroup: 'O_NEG',
      units: 2,
      division: 'Khulna',
      district: 'Khulna',
      thana: 'Khalishpur',
      urgency: 'NORMAL',
      deadline: new Date(Date.now() + 432000000), // 5 days from now
      patientCondition: 'Scheduled Heart Bypass',
      hemoglobin: '10.5',
      hospitalName: 'Khulna City Medical',
      detailedAddress: 'Cardiac Center',
      status: 'OPEN',
      contactPhone: '01555444333',
      isEmergency: false,
      managerId: managerId,
    }
  ];

  for (const req of requests) {
    const created = await prisma.bloodRequest.create({
      data: req as any
    });
    console.log(`✅ Created Request: ${created.bloodGroup} at ${created.hospitalName} (ID: ${created.id})`);
  }

  console.log('✨ Seeding 5 Dummy Blood Requests Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

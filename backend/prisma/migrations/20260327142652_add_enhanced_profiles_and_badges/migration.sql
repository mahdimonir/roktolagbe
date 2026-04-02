-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DONOR', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('OPEN', 'FULFILLED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "district" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "lastDonationDate" TIMESTAMP(3),
    "totalDonations" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "address" TEXT,
    "division" TEXT,
    "profileImage" TEXT,
    "bio" TEXT,
    "occupation" TEXT,
    "fbUrl" TEXT,
    "linkedinUrl" TEXT,

    CONSTRAINT "DonorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "logoUrl" TEXT,
    "inviteToken" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "address" TEXT,

    CONSTRAINT "ManagerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodInventory" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "group" "BloodGroup" NOT NULL,
    "units" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BloodInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgMember" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrgMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodRequest" (
    "id" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "units" INTEGER NOT NULL,
    "district" TEXT NOT NULL,
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "deadline" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'OPEN',
    "contactPhone" TEXT,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "managerId" TEXT,

    CONSTRAINT "BloodRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationHistory" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "requestId" TEXT,
    "donatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "imagePath" TEXT,
    "cardPath" TEXT,
    "notes" TEXT,

    CONSTRAINT "DonationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pointsCost" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "managerId" TEXT,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonorBadge" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DonorBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedeemedReward" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "voucherCode" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RedeemedReward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "DonorProfile_userId_key" ON "DonorProfile"("userId");

-- CreateIndex
CREATE INDEX "DonorProfile_bloodGroup_district_isAvailable_idx" ON "DonorProfile"("bloodGroup", "district", "isAvailable");

-- CreateIndex
CREATE UNIQUE INDEX "ManagerProfile_userId_key" ON "ManagerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ManagerProfile_inviteToken_key" ON "ManagerProfile"("inviteToken");

-- CreateIndex
CREATE INDEX "ManagerProfile_district_isVerified_type_idx" ON "ManagerProfile"("district", "isVerified", "type");

-- CreateIndex
CREATE UNIQUE INDEX "BloodInventory_managerId_group_key" ON "BloodInventory"("managerId", "group");

-- CreateIndex
CREATE UNIQUE INDEX "OrgMember_managerId_donorId_key" ON "OrgMember"("managerId", "donorId");

-- CreateIndex
CREATE INDEX "BloodRequest_bloodGroup_district_status_idx" ON "BloodRequest"("bloodGroup", "district", "status");

-- CreateIndex
CREATE INDEX "BloodRequest_urgency_status_idx" ON "BloodRequest"("urgency", "status");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "DonorBadge_donorId_badgeId_key" ON "DonorBadge"("donorId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "RedeemedReward_voucherCode_key" ON "RedeemedReward"("voucherCode");

-- CreateIndex
CREATE INDEX "RedeemedReward_userId_idx" ON "RedeemedReward"("userId");

-- AddForeignKey
ALTER TABLE "DonorProfile" ADD CONSTRAINT "DonorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerProfile" ADD CONSTRAINT "ManagerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodInventory" ADD CONSTRAINT "BloodInventory_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "ManagerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgMember" ADD CONSTRAINT "OrgMember_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "ManagerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgMember" ADD CONSTRAINT "OrgMember_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "DonorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "ManagerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationHistory" ADD CONSTRAINT "DonationHistory_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "DonorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationHistory" ADD CONSTRAINT "DonationHistory_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "BloodRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "ManagerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonorBadge" ADD CONSTRAINT "DonorBadge_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "DonorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonorBadge" ADD CONSTRAINT "DonorBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedeemedReward" ADD CONSTRAINT "RedeemedReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedeemedReward" ADD CONSTRAINT "RedeemedReward_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

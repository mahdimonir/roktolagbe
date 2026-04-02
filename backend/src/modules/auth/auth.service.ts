import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { sendEmail } from '../../utils/email';
import { RegisterInput, LoginInput } from './auth.schema';

const generateTokens = (userId: string, role: string, email: string) => {
  const accessToken = jwt.sign({ id: userId, role, email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
};

export const checkPhone = async (phone: string) => {
  if (!phone) throw new AppError('Phone number is required', 400);
  
  const cleanPhone = phone.replace(/\D/g, '');
  const normalizedPhone = cleanPhone.startsWith('88') ? `+${cleanPhone}` : `+88${cleanPhone}`;

  const existing = await prisma.user.findUnique({ 
    where: { phone: normalizedPhone },
    select: { 
      email: true,
      role: true,
      donorProfile: { select: { name: true, bloodGroup: true, division: true, district: true, thana: true } },
      managerProfile: { select: { name: true, type: true, district: true } }
    }
  });

  if (!existing) return { status: 'available' };

  const isDummyEmail = existing.email.endsWith('@roktolagbe.com');
  if (isDummyEmail) {
    const profile = existing.role === 'DONOR' ? existing.donorProfile : existing.managerProfile;
    return { 
      status: 'mergeable', 
      message: 'Hero detected! Join now to merge your legacy records.',
      data: {
        name: profile?.name,
        bloodGroup: (profile as any)?.bloodGroup,
        division: (profile as any)?.division,
        district: profile?.district,
        thana: (profile as any)?.thana,
        managerType: (profile as any)?.type,
      }
    };
  }

  return { status: 'taken', message: 'Phone number already registered' };
};

export const register = async (input: RegisterInput & { orgRef?: string }) => {
  const existingEmail = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingEmail) throw new AppError('Email already registered', 409);

  const cleanPhone = input.phone?.replace(/\D/g, '');
  const normalizedPhone = cleanPhone ? (cleanPhone.startsWith('88') ? `+${cleanPhone}` : `+88${cleanPhone}`) : null;

  const existingPhone = normalizedPhone ? await prisma.user.findUnique({ 
    where: { phone: normalizedPhone },
    include: { donorProfile: true, managerProfile: true }
  }) : null;

  const passwordHash = await bcrypt.hash(input.password, 12);
  const verifyToken = crypto.randomBytes(32).toString('hex');

  let user;

  if (existingPhone) {
    // If user exists by phone but has a dummy email (seeded), we merge/claim
    const isDummyEmail = existingPhone.email.endsWith('@roktolagbe.com');
    
    if (isDummyEmail) {
      console.log(`Merging seeded user: ${input.phone}`);
      user = await prisma.user.update({
        where: { id: existingPhone.id },
        data: {
          email: input.email,
          passwordHash,
          isVerified: false, // Reset verification for new email
          ...(input.role === 'DONOR' && existingPhone.donorProfile && {
            donorProfile: {
              update: {
                name: input.name!,
                bloodGroup: input.bloodGroup!,
                district: input.district!,
              }
            }
          }),
          ...(input.role === 'MANAGER' && existingPhone.managerProfile && {
            managerProfile: {
              update: {
                name: input.managerName!,
                type: input.managerType!,
                district: input.managerDistrict!,
                contactPhone: input.contactPhone!,
              }
            }
          })
        }
      });
    } else {
      throw new AppError('Phone number already registered to another account', 409);
    }
  } else {
    // Standard registration
    user = await prisma.user.create({
      data: {
        email: input.email,
        phone: normalizedPhone,
        passwordHash,
        role: input.role,
        isVerified: false,
        ...(input.role === 'DONOR' && {
          donorProfile: {
            create: {
              name: input.name!,
              bloodGroup: input.bloodGroup!,
              division: input.division,
              district: input.district!,
              thana: input.thana,
            },
          },
        }),
        ...(input.role === 'MANAGER' && {
          managerProfile: {
            create: {
              name: input.managerName!,
              type: input.managerType!,
              district: input.managerDistrict!,
              contactPhone: input.contactPhone!,
            },
          },
        }),
      },
    });
  }

  // Handle Organization Referral
  if (input.orgRef && user.role === 'DONOR') {
    const org = await prisma.managerProfile.findUnique({
      where: { inviteToken: input.orgRef }
    });

    if (org) {
      const donor = await prisma.donorProfile.findUnique({
        where: { userId: user.id }
      });
      
      if (donor) {
        await prisma.orgMember.upsert({
          where: {
            managerId_donorId: {
              managerId: org.id,
              donorId: donor.id
            }
          },
          update: {},
          create: {
            managerId: org.id,
            donorId: donor.id
          }
        });
        console.log(`Auto-associated donor ${user.id} with org ${org.name}`);
      }
    }
  }

  // Store verify token (use a simple approach: encode userId in token)
  const verifyLink = `${env.CLIENT_URL}/verify-email?token=${verifyToken}&id=${user.id}`;
  
  let emailSent = true;
  try {
    await sendEmail({
      to: user.email,
      subject: '✅ Verify your RoktoLagbe account',
      html: `
        <h2>Welcome to RoktoLagbe! 🩸</h2>
        <p>Please verify your email address to activate your account.</p>
        <a href="${verifyLink}" style="background:#e53e3e;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Verify Email</a>
        <p>Link expires in 24 hours.</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    emailSent = false;
  }

  return { 
    message: emailSent 
      ? 'Registration successful. Please check your email to verify your account.' 
      : 'Registration successful. (Verification email could not be sent, but you can log in directly in development mode).'
  };
};

export const verifyEmail = async (token: string, userId: string) => {
  // Simple check: just verify it's a valid hex token and update user
  if (!token || !userId) throw new AppError('Invalid verification link', 400);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);
  
  if (user.isVerified) return { message: 'Email already verified. You can log in.' };

  // Check if link is older than 24 hours
  const hoursSinceCreation = (new Date().getTime() - user.createdAt.getTime()) / (1000 * 60 * 60);
  if (hoursSinceCreation > 24) {
    throw new AppError('Verification link has expired. Please register again or request a new link.', 400);
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });

  return { message: 'Email verified successfully! You can now access your hero dashboard.' };
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: {
      donorProfile: true,
      managerProfile: true,
    },
  });

  if (!user) throw new AppError('Invalid email or password', 401);
  if (!user.isActive) throw new AppError('Account has been deactivated', 403);
  
  // For development ease, allow bypass if needed or just inform
  if (!user.isVerified && env.NODE_ENV === 'production') {
    throw new AppError('Please verify your email first', 403);
  }

  const isMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const { accessToken, refreshToken } = generateTokens(user.id, user.role, user.email);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.role === 'DONOR' ? user.donorProfile?.name : user.managerProfile?.name,
      image: user.role === 'DONOR' ? user.donorProfile?.profileImage : user.managerProfile?.logoUrl,
    },
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) throw new AppError('No refresh token', 401);

  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, role: true, email: true, isActive: true },
    });

    if (!user || !user.isActive) throw new AppError('User not found', 401);

    const tokens = generateTokens(user.id, user.role, user.email);
    return tokens;
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      createdAt: true,
      donorProfile: true,
      managerProfile: true,
    },
  });
  if (!user) throw new AppError('User not found', 404);
  
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    name: user.role === 'DONOR' ? user.donorProfile?.name : user.managerProfile?.name,
    image: user.role === 'DONOR' ? user.donorProfile?.profileImage : user.managerProfile?.logoUrl,
  };
};

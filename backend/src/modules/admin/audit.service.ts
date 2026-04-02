import { prisma } from '../../lib/prisma';

export const logAction = async (
  actorId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'BAN' | 'VERIFY' | 'CONFIG_CHANGE' | 'REWARD_REDEEM',
  entity: 'USER' | 'MANAGER' | 'REQUEST' | 'REWARD' | 'BADGE' | 'CONFIG' | 'DONATION' | 'INVENTORY',
  entityId?: string,
  details?: any
) => {
  try {
    return await prisma.auditLog.create({
      data: {
        actorId,
        action,
        entity,
        entityId,
        details: details || {},
      },
    });
  } catch (err) {
    console.error('[AuditLog Error]', err);
    // Don't throw to avoid breaking the main operation
  }
};

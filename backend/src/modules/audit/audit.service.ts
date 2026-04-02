import { prisma } from '../../lib/prisma';

export type AuditAction = 
  | 'REQUEST_CREATE' 
  | 'REQUEST_DELETE' 
  | 'DONATION_VERIFY' 
  | 'INVENTORY_SYNC' 
  | 'PROFILE_UPDATE' 
  | 'MESSAGE_SEND'
  | 'REWARD_REDEEM';

export type AuditEntity = 
  | 'USER' 
  | 'MANAGER' 
  | 'DONOR' 
  | 'REQUEST' 
  | 'DONATION' 
  | 'INVENTORY' 
  | 'MESSAGE'
  | 'REWARD';

export const logAction = async (
  actorId: string, 
  action: AuditAction, 
  entity: AuditEntity, 
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
  } catch (error) {
    // We don't want audit logging to crash the main request path
    console.error(`[AUDIT_FAILURE] Actor: ${actorId} | Action: ${action}`, error);
  }
};

import { api } from './d1-api';

export interface AuditLogOptions {
  adminId: string;
  actionType: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'verify' | 'upload' | 'custom';
  targetTable: string;
  targetId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  description: string;
}

export async function logAuditAction(accessToken: string, options: AuditLogOptions) {
  try {
    if (!options.adminId) return;

    await api(accessToken, 'queryTable', {
      table: 'admin_audit_log',
      operation: 'insert',
      data: {
        admin_id: options.adminId,
        action_type: options.actionType,
        target_table: options.targetTable,
        target_id: options.targetId,
        old_values: options.oldValues || null,
        new_values: options.newValues || null,
        description: options.description,
      },
    });
  } catch (err) {
    console.error('Failed to log audit action:', err);
    // Don't throw - audit log failures shouldn't break the main action
  }
}

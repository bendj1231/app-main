import { supabase } from '@/shared/lib/supabase';

export interface AuditLogOptions {
  actionType: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'verify' | 'upload' | 'custom';
  targetTable: string;
  targetId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  description: string;
}

export async function logAuditAction(options: AuditLogOptions) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return;

    await supabase.from('admin_audit_log').insert({
      admin_id: user.id,
      action_type: options.actionType,
      target_table: options.targetTable,
      target_id: options.targetId,
      old_values: options.oldValues || null,
      new_values: options.newValues || null,
      description: options.description,
    });
  } catch (err) {
    console.error('Failed to log audit action:', err);
    // Don't throw - audit log failures shouldn't break the main action
  }
}

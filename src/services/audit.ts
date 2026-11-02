import { db } from './db';
import { supabase, isSupabaseConfigured } from './supabase';
import { AuditLog } from '../types';

export const logAuditEvent = async (
  actor: string,
  role: string,
  action: string,
  details: string,
  entityType?: string,
  entityId?: string
): Promise<AuditLog> => {
  // 1. Always record in local store for immediate client UI reflection
  const localLog = db.addAuditLog(actor, role, action, details);

  // 2. Also forward to Supabase if live connection is active
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('audit_logs').insert({
        actor_email: actor,
        role,
        action,
        entity_type: entityType || 'System',
        entity_id: entityId || localLog.id,
        details: { description: details },
        ip_address: '127.0.0.1'
      });
    } catch (err) {
      console.warn('Failed to dispatch audit log to Supabase:', err);
    }
  }

  return localLog;
};

export const getAuditLogs = (): AuditLog[] => {
  return db.getAuditLogs();
};

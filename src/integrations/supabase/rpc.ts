
import { supabase } from './client';

/**
 * Insert a new admin record into the admins table
 * This function is used to bypass TypeScript limitations when the types.ts
 * file hasn't been properly updated to include new tables.
 */
export const insertAdminRecord = async (
  adminId: string, 
  fullName: string, 
  email: string
) => {
  return await supabase.rpc('insert_admin_record', {
    admin_id: adminId,
    admin_full_name: fullName,
    admin_email: email
  });
};

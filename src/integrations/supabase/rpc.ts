
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
  // Using the raw query functionality instead of rpc for type safety
  return await supabase.from('admins').insert({
    id: adminId,
    full_name: fullName,
    email: email
  });
};

/**
 * Validate an admin registration code
 */
export const validateAdminCode = async (code: string) => {
  return await supabase.rpc('validate_admin_code', { registration_code: code });
};

/**
 * Use an admin registration code
 */
export const useAdminCode = async (code: string, userId: string) => {
  return await supabase.rpc('use_admin_code', { 
    registration_code: code, 
    user_id: userId 
  });
};

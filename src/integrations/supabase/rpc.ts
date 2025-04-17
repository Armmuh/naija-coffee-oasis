
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
 * Note: This can only be called after the user is inserted in the auth.users table
 * as it references the user_id in the users table
 */
export const useAdminCode = async (code: string, userId: string) => {
  try {
    // First insert the user into the profiles table if it doesn't exist
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId,
        email: '', // Will be filled by the trigger
        is_admin: true
      }, { 
        onConflict: 'id',
        ignoreDuplicates: false
      });
    
    if (profileError) {
      console.error('Error ensuring profile exists:', profileError);
      return { error: profileError };
    }
    
    // Now we can safely use the admin code
    return await supabase.rpc('use_admin_code', { 
      registration_code: code, 
      user_id: userId 
    });
  } catch (error) {
    console.error('Error in useAdminCode:', error);
    return { error };
  }
};

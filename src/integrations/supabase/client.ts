// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gikfuonzcrftawxxldsl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpa2Z1b256Y3JmdGF3eHhsZHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NjUyNzAsImV4cCI6MjA1OTQ0MTI3MH0.ZLkSNCXzyOZcgPfLyQTzF8UFK-Gu5kWMDH2bs02vKbE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
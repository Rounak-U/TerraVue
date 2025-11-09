import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://ntfaehvnxiiplssmuavm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZmFlaHZueGlpcGxzc211YXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MjQzNjksImV4cCI6MjA1NzIwMDM2OX0.uwPV2vcFt8n4Wey-08CUPsxhdvQZpSUvyHkNrey03Jo';

export const supabase = createClient(supabaseUrl, supabaseKey);

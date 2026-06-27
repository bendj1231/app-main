import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAccountEmail() {
  try {
    console.log('📧 Sending test account creation email to pglenstenjoy@gmail.com...');
    
    const { data, error } = await supabase.functions.invoke('send-account-created-email', {
      body: {
        email: 'pglenstenjoy@gmail.com',
        name: 'Pilot'
      }
    });
    
    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log('✅ Success:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAccountEmail();

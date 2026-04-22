import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function unenrollUser(email) {
    try {
        console.log(`Searching for user with email: ${email}`);
        
        // Find user by email
        const { data: users, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email);
        
        if (fetchError) {
            console.error('Error fetching user:', fetchError);
            return;
        }
        
        if (!users || users.length === 0) {
            console.log(`No user found with email: ${email}`);
            return;
        }
        
        const user = users[0];
        console.log('Found user:', user.email);
        console.log('Current enrolled_programs:', user.enrolled_programs);
        console.log('User ID:', user.id);
        
        // Delete enrollment record from enrollments table
        console.log('Deleting enrollment record from enrollments table...');
        const { error: deleteError } = await supabase
            .from('enrollments')
            .delete()
            .eq('user_id', user.id)
            .eq('program_name', 'Foundational');
        
        if (deleteError) {
            console.error('Error deleting enrollment record:', deleteError);
            // Continue anyway, as the record might not exist
        } else {
            console.log('Successfully deleted enrollment record from enrollments table');
        }
        
        // Remove 'Foundational' from enrolled_programs
        const updatedEnrolledPrograms = (user.enrolled_programs || []).filter(
            program => program !== 'Foundational'
        );
        
        if (updatedEnrolledPrograms.length === user.enrolled_programs.length) {
            console.log('User is not enrolled in Foundational program');
            return;
        }
        
        console.log('Updated enrolled_programs:', updatedEnrolledPrograms);
        
        // Update the user profile - clear all enrollment-related fields
        const { data, error: updateError } = await supabase
            .from('profiles')
            .update({ 
                enrolled_programs: updatedEnrolledPrograms,
                enrollment_status: null,
                enrollment_date: null,
                enrollment_completed_at: null,
                updated_at: new Date().toISOString()
            })
            .eq('email', email)
            .select();
        
        if (updateError) {
            console.error('Error updating user:', updateError);
            return;
        }
        
        console.log('Successfully unenrolled user from Foundational program');
        console.log('Updated profile:', data[0]);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address as an argument');
    console.log('Usage: node scripts/unenroll-user.js <email>');
    process.exit(1);
}

unenrollUser(email);

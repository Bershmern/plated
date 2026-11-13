import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hbfvcoeognbhwkfybohn.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function createDevUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@gmail.com',
    password: 'password1234', 
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes('already exists') || error.message.includes('already registered')) {
      console.log('User admin@gmail.com already exists. Updating password...');
      
      const { data: usersData } = await supabase.auth.admin.listUsers();
      const user = usersData.users.find(u => u.email === 'admin@gmail.com');
      if (user) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          password: 'password1234'
        });
        if (updateError) {
          console.error('Failed to update password:', updateError);
        } else {
          console.log('Password updated to password1234 for admin@gmail.com');
        }
      }
    } else {
      console.error('Error creating user:', error);
    }
  } else {
    console.log('Successfully created admin@gmail.com with password password1234');
  }
}

createDevUser();

import { createClient } from "npm:@supabase/supabase-js";

// Create Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export async function setupDatabase() {
  console.log('Starting database setup...');
  
  try {
    // First, let's try to create the professors table directly
    console.log('Creating professors table...');
    
    // Use raw SQL query to create table
    const { data, error: createError } = await supabase.rpc('sql', {
      query: `
        create table if not exists public.professors (
          id uuid primary key default gen_random_uuid(),
          first_name text not null,
          last_name text not null,
          title text,
          department text,
          email text,
          office_location text,
          courses text check (char_length(courses) <= 200),
          bio text check (char_length(bio) <= 500),
          created_at timestamp with time zone default now()
        );
        
        -- Enable RLS
        alter table public.professors enable row level security;
        
        -- Create policies
        drop policy if exists "Everyone can view professors" on public.professors;
        drop policy if exists "Authenticated users can add professors" on public.professors;
        
        create policy "Everyone can view professors" on public.professors
            for select using (true);
            
        create policy "Authenticated users can add professors" on public.professors
            for insert with check (auth.role() = 'authenticated');
        
        -- Create indexes
        create index if not exists idx_professors_department on public.professors(department);
        create index if not exists idx_professors_created_at on public.professors(created_at);
      `
    });

    if (createError) {
      console.log('Table creation error:', createError);
      
      // If the rpc function doesn't exist, try using a simple insert to test connection
      console.log('Trying alternative setup method...');
      
      // Try to just test the connection by selecting from auth.users
      const { error: testError } = await supabase.auth.getUser();
      
      if (testError) {
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('Database connection is working, but table creation may need to be done manually');
      return { 
        success: true, 
        message: 'Database connected. Table already exists or needs to be created manually in Supabase dashboard.' 
      };
    }

    console.log('Database setup completed successfully');
    return { 
      success: true, 
      message: 'Database tables and policies created successfully' 
    };

  } catch (error) {
    console.error('Database setup failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Please ensure the professors table exists in your Supabase dashboard'
    };
  }
}

// Test database connection
export async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Try to query the professors table
    const { data, error } = await supabase
      .from('professors')
      .select('count')
      .limit(1);

    if (error) {
      console.log('Professors table query error:', error);
      
      // If table doesn't exist, that's expected - just test basic connection
      if (error.code === 'PGRST116' || error.message.includes('relation "professors" does not exist')) {
        console.log('Professors table does not exist (expected)');
        
        // Test basic auth connection instead
        try {
          const { data: authData, error: authError } = await supabase.auth.getSession();
          console.log('Auth service is accessible');
          return { 
            connected: true, 
            tableExists: false,
            message: 'Database connected but professors table needs to be created'
          };
        } catch (authError) {
          return { 
            connected: false, 
            error: 'Cannot connect to Supabase services'
          };
        }
      }
      
      return { 
        connected: false, 
        error: error.message,
        details: 'Database connection failed'
      };
    }

    console.log('Database connection and table access successful');
    return { 
      connected: true, 
      tableExists: true,
      message: 'Database and professors table are working correctly'
    };
    
  } catch (error) {
    console.log('Connection test failed:', error);
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
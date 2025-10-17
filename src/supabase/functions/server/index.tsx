import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
import { setupDatabase, testConnection } from "./setup.tsx";

const app = new Hono();

// Create Supabase client with service role key for server operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to get user from JWT token
async function getUserFromToken(authorization: string | null) {
  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('No authorization header or invalid format');
    return null;
  }
  
  const token = authorization.split(' ')[1];
  console.log('Attempting to get user with token length:', token ? token.length : 0);
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.log('Auth error or no user:', error);
    return null;
  }
  
  console.log('Successfully authenticated user:', user.id);
  return user;
}

// Health check endpoint
app.get("/make-server-f3396eba/health", (c) => {
  console.log('Health check endpoint called');
  return c.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    supabaseUrl: Deno.env.get('SUPABASE_URL') ? 'configured' : 'not configured',
    serviceKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'configured' : 'not configured'
  });
});

// Database setup endpoint
app.post("/make-server-f3396eba/setup", async (c) => {
  console.log('Database setup endpoint called');
  try {
    const result = await setupDatabase();
    return c.json(result);
  } catch (error) {
    console.log('Setup endpoint error:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Create table endpoint - simplified approach
app.post("/make-server-f3396eba/create-table", async (c) => {
  console.log('Create table endpoint called');
  try {
    // Simple table creation without RPC
    const { data, error } = await supabase
      .from('professors')
      .select('id')
      .limit(1);

    if (error && (error.code === 'PGRST116' || error.message.includes('does not exist'))) {
      console.log('Table does not exist, need to create it manually');
      return c.json({ 
        success: false, 
        message: 'Table does not exist. Please create it manually in Supabase dashboard using the SQL from the debug page or the simplified_setup.sql file.'
      });
    } else if (error) {
      return c.json({ 
        success: false, 
        error: 'Database error: ' + error.message 
      });
    } else {
      return c.json({ 
        success: true, 
        message: 'Table already exists and is accessible' 
      });
    }
  } catch (error) {
    console.log('Create table endpoint error:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Get all professors
app.get("/make-server-f3396eba/professors", async (c) => {
  console.log('GET /professors endpoint called');
  
  try {
    console.log('Fetching professors from database...');

    // Direct query to professors table - no unnecessary RPC calls
    const { data: professors, error } = await supabase
      .from('professors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Database error fetching professors:', error);
      
      // If table doesn't exist, return empty array with helpful message
      if (error.code === 'PGRST116' || error.message.includes('table') && error.message.includes('does not exist')) {
        console.log('Professors table does not exist');
        return c.json({ 
          professors: [],
          message: 'Professors table does not exist. Please create it using the setup SQL.'
        });
      }
      
      return c.json({ error: 'Failed to fetch professors', details: error.message }, 500);
    }

    console.log(`Successfully fetched ${professors?.length || 0} professors`);
    return c.json({ professors: professors || [] });
  } catch (error) {
    console.log('Unexpected error in /professors endpoint:', error);
    return c.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Add a new professor
app.post("/make-server-f3396eba/professors", async (c) => {
  console.log('POST /professors endpoint called');
  
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      console.log('Unauthorized request to add professor');
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    console.log('Request body for adding professor:', body);
    
    const { firstName, lastName, title, department, email, officeLocation, courses, bio } = body;

    if (!firstName || !lastName || !title || !department) {
      console.log('Missing required fields:', { firstName, lastName, title, department });
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const professorData = {
      first_name: firstName,
      last_name: lastName,
      title,
      department,
      email: email || null,
      office_location: officeLocation || null,
      courses: courses || null,
      bio: bio || null,
      created_by: user.id // Add the user ID for the creator
    };
    
    console.log('Inserting professor data:', professorData);

    const { data: professor, error } = await supabase
      .from('professors')
      .insert(professorData)
      .select()
      .single();

    if (error) {
      console.log('Database error creating professor:', error);
      
      // If table doesn't exist, provide helpful error
      if (error.code === 'PGRST116' || error.message.includes('relation "professors" does not exist')) {
        return c.json({ 
          error: 'Database not properly set up', 
          details: 'The professors table does not exist. Please run the setup SQL script.' 
        }, 500);
      }
      
      return c.json({ 
        error: 'Failed to create professor', 
        details: error.message 
      }, 500);
    }

    console.log('Successfully created professor:', professor);
    return c.json({ professor });
  } catch (error) {
    console.log('Unexpected error in /professors POST endpoint:', error);
    return c.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Get professors by department
app.get("/make-server-f3396eba/professors/department/:department", async (c) => {
  try {
    const department = c.req.param('department');
    
    const { data: professors, error } = await supabase
      .from('professors')
      .select('*')
      .eq('department', department)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error fetching professors by department:', error);
      return c.json({ error: 'Failed to fetch professors' }, 500);
    }

    return c.json({ professors });
  } catch (error) {
    console.log('Error in /professors/department endpoint:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Search professors
app.get("/make-server-f3396eba/professors/search", async (c) => {
  try {
    const query = c.req.query('q');
    if (!query) {
      return c.json({ professors: [] });
    }

    const { data: professors, error } = await supabase
      .from('professors')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,department.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error searching professors:', error);
      return c.json({ error: 'Failed to search professors' }, 500);
    }

    return c.json({ professors });
  } catch (error) {
    console.log('Error in /professors/search endpoint:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Submit a professor rating
app.post("/make-server-f3396eba/professors/:professorId/ratings", async (c) => {
  console.log('POST /professors/:professorId/ratings endpoint called');
  
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      console.log('Unauthorized request to submit rating');
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const professorId = c.req.param('professorId');
    const body = await c.req.json();
    console.log('Request body for submitting rating:', body);
    
    const { 
      courseCode, 
      isOnlineCourse, 
      overallRating, 
      difficulty, 
      wouldTakeAgain, 
      takenForCredit, 
      usedTextbooks, 
      attendanceMandatory, 
      gradeReceived, 
      selectedTags, 
      review 
    } = body;

    if (!courseCode || !overallRating || !difficulty || !wouldTakeAgain || !review) {
      console.log('Missing required fields for rating');
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Check if professor exists
    const { data: professor, error: profError } = await supabase
      .from('professors')
      .select('id')
      .eq('id', professorId)
      .single();

    if (profError || !professor) {
      console.log('Professor not found:', profError);
      return c.json({ error: 'Professor not found' }, 404);
    }

    // Check if user has already rated this professor
    const { data: existingRating, error: existingError } = await supabase
      .from('professor_ratings')
      .select('id')
      .eq('professor_id', professorId)
      .eq('user_id', user.id)
      .single();

    if (existingRating) {
      console.log('User has already rated this professor');
      return c.json({ error: 'You have already rated this professor' }, 400);
    }

    const ratingData = {
      professor_id: professorId,
      user_id: user.id,
      course_code: courseCode,
      is_online: isOnlineCourse || false,
      rating: parseInt(overallRating),
      difficulty: parseInt(difficulty),
      would_take_again: wouldTakeAgain === 'yes',
      for_credit: takenForCredit === 'yes' || null,
      used_textbooks: usedTextbooks === 'yes' || null,
      attendance_mandatory: attendanceMandatory === 'yes' || null,
      grade: gradeReceived || null,
      tags: selectedTags || [],
      review: review
    };
    
    console.log('Inserting rating data:', ratingData);

    const { data: rating, error } = await supabase
      .from('professor_ratings')
      .insert(ratingData)
      .select()
      .single();

    if (error) {
      console.log('Database error creating rating:', error);
      return c.json({ 
        error: 'Failed to create rating', 
        details: error.message 
      }, 500);
    }

    console.log('Successfully created rating:', rating);
    return c.json({ rating, message: 'Rating submitted successfully' });
  } catch (error) {
    console.log('Unexpected error in /professors/:professorId/ratings POST endpoint:', error);
    return c.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Get professor ratings with aggregated data
app.get("/make-server-f3396eba/professors/:professorId/ratings", async (c) => {
  console.log('GET /professors/:professorId/ratings endpoint called');
  
  try {
    const professorId = c.req.param('professorId');
    console.log('Fetching ratings for professor ID:', professorId);

    // Get all ratings for this professor (simplified query without user join)
    const { data: ratings, error: ratingsError } = await supabase
      .from('professor_ratings')
      .select('*')
      .eq('professor_id', professorId)
      .order('created_at', { ascending: false });

    if (ratingsError) {
      console.log('Error fetching ratings:', ratingsError);
      return c.json({ 
        error: 'Failed to fetch ratings', 
        details: ratingsError.message,
        code: ratingsError.code 
      }, 500);
    }

    // Calculate aggregated stats
    const totalRatings = ratings?.length || 0;
    let avgRating = 0;
    let avgDifficulty = 0;
    const allTags: string[] = [];

    if (totalRatings > 0) {
      const totalRatingSum = ratings.reduce((sum, r) => sum + r.rating, 0);
      const totalDifficultySum = ratings.reduce((sum, r) => sum + r.difficulty, 0);
      
      avgRating = totalRatingSum / totalRatings;
      avgDifficulty = totalDifficultySum / totalRatings;

      // Collect all tags
      ratings.forEach(r => {
        if (r.tags && Array.isArray(r.tags)) {
          allTags.push(...r.tags);
        }
      });
    }

    // Count tag frequency
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    console.log(`Successfully fetched ${totalRatings} ratings for professor ${professorId}`);
    
    return c.json({ 
      ratings: ratings || [],
      stats: {
        totalRatings,
        avgRating: Math.round(avgRating * 10) / 10,
        avgDifficulty: Math.round(avgDifficulty * 10) / 10,
        topTags
      }
    });
  } catch (error) {
    console.log('Unexpected error in /professors/:professorId/ratings GET endpoint:', error);
    return c.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Test ratings table structure
app.get("/make-server-f3396eba/test-ratings", async (c) => {
  console.log('GET /test-ratings endpoint called');
  
  try {
    // Try to get one rating to test table structure
    const { data: ratings, error } = await supabase
      .from('professor_ratings')
      .select('*')
      .limit(1);

    if (error) {
      console.log('Error testing ratings table:', error);
      return c.json({ 
        success: false,
        error: 'Failed to access ratings table', 
        details: error.message,
        code: error.code 
      }, 500);
    }

    console.log('Ratings table test successful:', ratings);
    return c.json({ 
      success: true,
      message: 'Ratings table accessible',
      sampleData: ratings,
      count: ratings?.length || 0
    });
  } catch (error) {
    console.log('Unexpected error testing ratings table:', error);
    return c.json({ 
      success: false,
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Get user's own ratings
app.get("/make-server-f3396eba/users/ratings", async (c) => {
  console.log('GET /users/ratings endpoint called');
  
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      console.log('Unauthorized request to get user ratings');
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: ratings, error } = await supabase
      .from('professor_ratings')
      .select(`
        *,
        professors (
          id,
          first_name,
          last_name,
          title,
          department
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error fetching user ratings:', error);
      return c.json({ error: 'Failed to fetch user ratings' }, 500);
    }

    console.log(`Successfully fetched ${ratings?.length || 0} ratings for user ${user.id}`);
    return c.json({ ratings: ratings || [] });
  } catch (error) {
    console.log('Unexpected error in /users/ratings GET endpoint:', error);
    return c.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

Deno.serve(app.fetch);
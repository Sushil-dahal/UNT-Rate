import { projectId, publicAnonKey } from './supabase/info';

export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f3396eba`;

// Health check to test if server is running
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

// Setup database
export const setupDatabase = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/setup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Setup failed: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Database setup error:', error);
    throw error;
  }
};

// Create table endpoint - simplified
export const createTable = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-table`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Create table failed: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Create table error:', error);
    throw error;
  }
};

// Test database connection
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-connection`);
    if (!response.ok) {
      throw new Error(`Connection test failed: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Connection test error:', error);
    throw error;
  }
};

// Public API calls (no authentication required)
export const fetchProfessors = async () => {
  try {
    console.log('Fetching professors from:', `${API_BASE_URL}/professors`);
    
    const response = await fetch(`${API_BASE_URL}/professors`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error text:', errorText);
      throw new Error(`Failed to fetch professors: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Fetched professors data:', data);
    
    // Handle both cases: when professors are returned directly or in a wrapper object
    if (Array.isArray(data)) {
      return data;
    } else if (data.professors && Array.isArray(data.professors)) {
      return data.professors;
    } else {
      console.warn('Unexpected data format:', data);
      return [];
    }
  } catch (error) {
    console.error('Error in fetchProfessors:', error);
    throw error;
  }
};

// Authenticated API calls
export const addProfessor = async (professorData: any, accessToken: string) => {
  try {
    console.log('Adding professor with data:', professorData);
    console.log('Using access token:', accessToken ? 'Token provided' : 'No token');
    
    const response = await fetch(`${API_BASE_URL}/professors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(professorData),
    });

    console.log('Add professor response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Add professor error text:', errorText);
      
      let result;
      try {
        result = JSON.parse(errorText);
      } catch {
        result = { error: errorText };
      }
      
      throw new Error(result.error || `Failed to add professor: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Add professor success:', result);
    return result;
  } catch (error) {
    console.error('Error in addProfessor:', error);
    throw error;
  }
};

// Submit professor rating
export const submitProfessorRating = async (professorId: string, ratingData: any, accessToken: string) => {
  try {
    console.log('Submitting rating for professor:', professorId, 'with data:', ratingData);
    
    const response = await fetch(`${API_BASE_URL}/professors/${professorId}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(ratingData),
    });

    console.log('Submit rating response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Submit rating error text:', errorText);
      
      let result;
      try {
        result = JSON.parse(errorText);
      } catch {
        result = { error: errorText };
      }
      
      throw new Error(result.error || `Failed to submit rating: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Submit rating success:', result);
    return result;
  } catch (error) {
    console.error('Error in submitProfessorRating:', error);
    throw error;
  }
};

// Fetch professor ratings
export const fetchProfessorRatings = async (professorId: string) => {
  try {
    console.log('Fetching ratings for professor:', professorId);
    
    const response = await fetch(`${API_BASE_URL}/professors/${professorId}/ratings`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    console.log('Fetch ratings response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch ratings error text:', errorText);
      throw new Error(`Failed to fetch ratings: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Fetch ratings success:', result);
    return result;
  } catch (error) {
    console.error('Error in fetchProfessorRatings:', error);
    throw error;
  }
};

// Test ratings table
export const testRatingsTable = async () => {
  try {
    console.log('Testing ratings table...');
    
    const response = await fetch(`${API_BASE_URL}/test-ratings`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    console.log('Test ratings response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Test ratings error text:', errorText);
      throw new Error(`Failed to test ratings table: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Test ratings success:', result);
    return result;
  } catch (error) {
    console.error('Error in testRatingsTable:', error);
    throw error;
  }
};

// Fetch user's own ratings
export const fetchUserRatings = async (accessToken: string) => {
  try {
    console.log('Fetching user ratings');
    
    const response = await fetch(`${API_BASE_URL}/users/ratings`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('Fetch user ratings response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch user ratings error text:', errorText);
      throw new Error(`Failed to fetch user ratings: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Fetch user ratings success:', result);
    return result;
  } catch (error) {
    console.error('Error in fetchUserRatings:', error);
    throw error;
  }
};
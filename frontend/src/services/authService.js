/**
 * Service to handle authentication requests.
 * Connects to the Express backend server.
 */

const API_URL = import.meta.env.VITE_API_URL || '';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || 'Invalid email or password',
      };
    }

    return {
      success: true,
      message: data?.message || 'Login successful',
      token: data?.token,
      user: data?.user,
    };
  } catch (error) {
    console.error('API request failed:', error);
    
    // Return standard message if the server is down or unreachable
    return {
      success: false,
      message: 'Unable to connect to server',
    };
  }
};

/**
 * Service to register a new user.
 */
export const registerUser = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || 'Registration failed',
      };
    }

    return {
      success: true,
      message: data?.message || 'User registered successfully',
    };
  } catch (error) {
    console.error('API registration request failed:', error);
    return {
      success: false,
      message: 'Unable to connect to server',
    };
  }
};

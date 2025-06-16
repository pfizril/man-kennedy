const API_URL = 'http://localhost:8000/api';

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const getAuthHeader = (): Record<string, string> => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  
  console.log('=== API Auth Header Debug ===');
  console.log('All cookies:', document.cookie);
  console.log('Token exists:', !!token);
  console.log('Token value:', token);
  console.log('=== End API Auth Header Debug ===');
  
  if (!token) {
    console.warn('No token found in cookies');
    return {};
  }
  
  return { 'Authorization': `Bearer ${token}` };
};

export const api = {
  async login(data: LoginData): Promise<LoginResponse> {
    console.log('=== API Login Request ===');
    console.log('Request data:', { ...data, password: '[REDACTED]' });
    
    const response = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const error = await response.json();
      console.error('Login request failed:', error);
      throw new Error(error.error || 'Login failed');
    }

    const result = await response.json();
    console.log('Login successful:', { ...result, access: '[REDACTED]', refresh: '[REDACTED]' });
    console.log('=== End API Login Request ===');
    return result;
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    console.log('=== API Register Request ===');
    console.log('Request data:', { ...data, password: '[REDACTED]' });
    
    const response = await fetch(`${API_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const error = await response.json();
      console.error('Registration request failed:', error);
      throw new Error(error.error || 'Registration failed');
    }

    const result = await response.json();
    console.log('Registration successful:', { ...result, access: '[REDACTED]', refresh: '[REDACTED]' });
    console.log('=== End API Register Request ===');
    return result;
  },

  async refreshToken(refresh: string): Promise<{ access: string }> {
    console.log('=== API Token Refresh Request ===');
    console.log('Refresh token:', refresh ? '[REDACTED]' : 'none');
    
    const response = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ refresh }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error('Token refresh request failed');
      throw new Error('Token refresh failed');
    }

    const result = await response.json();
    console.log('Token refresh successful:', { access: '[REDACTED]' });
    console.log('=== End API Token Refresh Request ===');
    return result;
  },

  async getProfile() {
    console.log('=== API Profile Request ===');
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    };

    console.log('Request headers:', headers);

    const response = await fetch(`${API_URL}/auth/profile/`, {
      headers,
      credentials: 'include',
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      console.error('Profile request failed:', error);
      throw new Error(error.error || 'Failed to fetch profile');
    }

    const result = await response.json();
    console.log('Profile request successful:', result);
    console.log('=== End API Profile Request ===');
    return result;
  },
}; 
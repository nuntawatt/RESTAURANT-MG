const API_URL = 'http://localhost:5000/api';

class AuthService {
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('userToken', data.token);
                return data;
            }
        } catch (error) {
            throw error;
        }
    }

    async signup(userData) {
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Signup failed');
            }

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('userToken', data.token);
                return data;
            }
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            localStorage.removeItem('userToken');
            // Additional cleanup if needed
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    async getUserProfile() {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) throw new Error('No token found');

            const response = await fetch(`${API_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    isAuthenticated() {
        return !!localStorage.getItem('userToken');
    }
}

const authService = new AuthService();
export default authService;
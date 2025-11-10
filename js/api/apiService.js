import tokenService from './tokenService.js';

class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.retryCount = 3;
    }

    async fetch(url, options = {}) {
        let attempts = 0;
        while (attempts < this.retryCount) {
            try {
                const token = tokenService.getToken();
                if (token) {
                    options.headers = {
                        ...options.headers,
                        'Authorization': `Bearer ${token}`
                    };
                }

                const response = await fetch(this.baseURL + url, options);

                // Handle 401 Unauthorized
                if (response.status === 401) {
                    // Try to refresh token
                    const newToken = await tokenService.refreshAccessToken();
                    if (newToken) {
                        options.headers['Authorization'] = `Bearer ${newToken}`;
                        return this.fetch(url, options); // Retry with new token
                    }
                    throw new Error('Authentication failed');
                }

                // Handle other errors
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Request failed');
                }

                return await response.json();
            } catch (error) {
                attempts++;
                if (attempts === this.retryCount) {
                    throw error;
                }
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            }
        }
    }

    get(url) {
        return this.fetch(url);
    }

    post(url, data) {
        return this.fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    put(url, data) {
        return this.fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    delete(url) {
        return this.fetch(url, {
            method: 'DELETE'
        });
    }
}

const apiService = new ApiService();
export default apiService;
class TokenService {
    constructor() {
        this.tokenKey = 'userToken';
        this.refreshTokenKey = 'refreshToken';
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    getRefreshToken() {
        return localStorage.getItem(this.refreshTokenKey);
    }

    setTokens(token, refreshToken) {
        localStorage.setItem(this.tokenKey, token);
        if (refreshToken) {
            localStorage.setItem(this.refreshTokenKey, refreshToken);
        }
    }

    removeTokens() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    async refreshAccessToken() {
        try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) throw new Error('No refresh token');

            const response = await fetch('http://localhost:5000/api/users/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) throw new Error('Token refresh failed');

            const data = await response.json();
            this.setTokens(data.token, data.refreshToken);
            return data.token;
        } catch (error) {
            this.removeTokens();
            throw error;
        }
    }
}

const tokenService = new TokenService();
export default tokenService;
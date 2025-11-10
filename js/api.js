const API_URL = 'http://localhost:5000/api';

// Authentication Functions
const auth = {
    async register(userData) {
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('userToken', data.token);
                return data;
            }
            throw new Error(data.message);
        } catch (error) {
            throw error;
        }
    },

    async login(credentials) {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('userToken', data.token);
                return data;
            }
            throw new Error(data.message);
        } catch (error) {
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('userToken');
        window.location.href = '/login.html';
    },

    getToken() {
        return localStorage.getItem('userToken');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};

// Menu Functions
const menu = {
    async getAllItems() {
        try {
            const response = await fetch(`${API_URL}/menu`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async getItemsByCategory(category) {
        try {
            const response = await fetch(`${API_URL}/menu/category/${category}`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};

// Cart Functions
const cart = {
    async getCart() {
        try {
            const response = await fetch(`${API_URL}/cart`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async addItem(menuItemId, quantity, price) {
        try {
            const response = await fetch(`${API_URL}/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                body: JSON.stringify({ menuItemId, quantity, price })
            });
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async removeItem(itemId) {
        try {
            const response = await fetch(`${API_URL}/cart/remove/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async clearCart() {
        try {
            const response = await fetch(`${API_URL}/cart/clear`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};

// Review Functions
const reviews = {
    async getMenuItemReviews(menuItemId) {
        try {
            const response = await fetch(`${API_URL}/reviews/menu/${menuItemId}`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async addReview(menuItemId, rating, comment) {
        try {
            const response = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                body: JSON.stringify({ menuItemId, rating, comment })
            });
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};

// Reservation Functions
const reservations = {
    async getMyReservations() {
        try {
            const response = await fetch(`${API_URL}/reservations/my`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async checkAvailability(date) {
        try {
            const response = await fetch(`${API_URL}/reservations/available/${date}`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async makeReservation(reservationData) {
        try {
            const response = await fetch(`${API_URL}/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                body: JSON.stringify(reservationData)
            });
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};

// Export all API functions
window.restaurantAPI = {
    auth,
    menu,
    cart,
    reviews,
    reservations
};
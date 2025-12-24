// Base API URL
// api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// Common fetch function
const apiRequest = async (endpoint, method = 'GET', data = null, token = null) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        method,
        headers,
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Request failed');
        }
        
        return result;
    } catch (error) {
        console.error(`API ${method} ${endpoint} error:`, error);
        throw error;
    }
};

// Auth API
export const authAPI = {
    register: (userData) => apiRequest('/auth/register', 'POST', userData),
    login: (credentials) => apiRequest('/auth/login', 'POST', credentials),
    getMe: (token) => apiRequest('/auth/me', 'GET', null, token),
};

// Contact API
export const contactAPI = {
    submitContact: (data) => apiRequest('/contact', 'POST', data),
};

// Callback API
export const callbackAPI = {
    requestCallback: (data) => apiRequest('/callback', 'POST', data),
};

// Products API
export const productsAPI = {
    getProducts: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return apiRequest(`/products${queryParams ? `?${queryParams}` : ''}`);
    },
    getProductById: (id) => apiRequest(`/products/${id}`),
};

// Orders API
export const ordersAPI = {
    createOrder: (orderData, token) => apiRequest('/orders', 'POST', orderData, token),
    getMyOrders: (token) => apiRequest('/orders/my-orders', 'GET', null, token),
};
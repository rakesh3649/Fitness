// orderService.js
const API_BASE_URL = 'http://localhost:5000/api';

export const createOrder = async (orderData) => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Please login to complete your order');
        }

        console.log('Creating order:', orderData);

        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Order failed');
        }

        console.log('Order created successfully:', data);
        return data;
    } catch (error) {
        console.error('Order creation error:', error);
        throw error;
    }
};

export const getMyOrders = async () => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Please login to view your orders');
        }

        const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch orders');
        }

        return data;
    } catch (error) {
        console.error('Get orders error:', error);
        throw error;
    }
};
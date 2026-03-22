const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('=== ENVIRONMENT VARIABLES ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set');
console.log('=============================');

// Import routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const callbackRoutes = require('./routes/callbackRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// ========== CORS CONFIGURATION ==========
const corsOptions = {
    credentials: true,
    optionsSuccessStatus: 200
};

if (process.env.NODE_ENV === 'development') {
    // In development: Allow ALL localhost ports
    console.log('🔓 Development mode: Allowing ALL localhost ports');
    corsOptions.origin = /^http:\/\/localhost:\d+$/;
} else {
    // In production: Allow only specific domain
    console.log('🔒 Production mode: Using strict CORS');
    corsOptions.origin = process.env.CORS_ORIGIN || 'http://localhost:3000';
}

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
// ========================================

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    console.log('Origin:', req.headers.origin);
    console.log('Body:', req.body);
    next();
});

// ========== DATABASE CONNECTION ==========
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitnessgym', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📁 Database: ${mongoose.connection.name}`);
})
.catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⚠️ Running without database connection...');
});
// ========================================

// ========== API ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/callback', callbackRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
// ================================

// ========== TEST ENDPOINTS ==========
// Simple callback endpoint (works without database)
app.post('/api/test-callback', (req, res) => {
    console.log('📞 TEST Callback received:', req.body);
    
    if (!req.body.name || !req.body.phone) {
        return res.status(400).json({
            success: false,
            message: 'Name and phone are required'
        });
    }
    
    res.status(200).json({
        success: true,
        message: 'TEST: Callback request received successfully!',
        data: {
            id: Date.now(),
            name: req.body.name,
            phone: req.body.phone,
            status: 'pending',
            createdAt: new Date().toISOString()
        }
    });
});

// Simple contact endpoint (works without database)
app.post('/api/test-contact', (req, res) => {
    console.log('📧 TEST Contact received:', req.body);
    
    res.status(200).json({
        success: true,
        message: 'TEST: Contact form submitted successfully!',
        data: req.body
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbStatus] || 'unknown';
    
    res.status(200).json({
        success: true,
        message: 'FitnessGym Backend is running',
        environment: process.env.NODE_ENV,
        cors: 'Configured for development (all localhost ports)',
        database: dbStatusText,
        timestamp: new Date().toISOString(),
        endpoints: {
            callback: '/api/callback',
            contact: '/api/contact',
            testCallback: '/api/test-callback',
            testContact: '/api/test-contact',
            health: '/api/health'
        }
    });
});
// ===================================

// ========== ERROR HANDLING ==========
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        availableEndpoints: [
            'GET  /api/health',
            'POST /api/callback',
            'POST /api/contact',
            'POST /api/test-callback',
            'POST /api/test-contact'
        ]
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
// ====================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔓 CORS: Allowing ALL localhost ports`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📞 Test callback: http://localhost:${PORT}/api/test-callback`);
    console.log(`📧 Test contact: http://localhost:${PORT}/api/test-contact`);
});
